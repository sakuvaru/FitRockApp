import { ChangeDetectorRef, Component, Input, Output, EventEmitter, ViewContainerRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs/Rx';

// common
import { BaseWebComponent } from '../base-web-component.class';

// data form 
import { DataFormConfig } from './data-form.config';
import { DataFormActiomEnum, DataFormSectionSize, DataFormFieldTypeEnum } from './data-form.enums';
import {
    DataFormDeleteResponse, DataFormEditDefinition, DataFormEditResponse, DataFormField,
    DataFormInsertDefinition, DataFormInsertResponse, DataFormSection
} from './data-form-models';

// additional services
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';
import { observableHelper } from '../../lib/utilities';
import { LocalizationService } from '../../lib/localization';
import { TdDialogService } from '@covalent/core';

@Component({
    selector: 'data-form',
    templateUrl: 'data-form.component.html'
})
export class DataFormComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Configuration object
     */
    @Input() config: DataFormConfig;

    /**
     * Used for triggering form actions
     */
    private formActionSubject = new Subject<DataFormActiomEnum>();

    /**
     * Subject for reloading form definition
     */
    private initFormSubject = new Subject<boolean>();

    /**
     * Subject for form changes
     */
    private formChangeSubject = new Subject<FormGroup>();

    /**
     * Subject for form value changes
     */
    private formValueChangeSubject = new Subject<any>();

    /**
     * Subject for form status changes. Indicates if form is valid or invalid
     */
    private formStatusChangeSubject = new Subject<boolean>();

    /**
     * Form value change event
     */
    public formValueChange: Observable<any> = this.formValueChangeSubject;

    /**
     * Form status change event
     */
    public formStatusChange: Observable<boolean> = this.formStatusChangeSubject;

    /**
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = false;

    /**
     * Form group
     */
    public formGroup?: FormGroup;

    /**
     * Rows of fields
     */
    public rows: DataFormRow[] = [];

    /**
     * Temp fields
     */
    private fields: DataFormField[] = [];

    /**
     * Indicates if there is a problem with loading form
     */
    private errorLoadingForm: boolean = false;

    /**
     * Indicates if unknown error occured
     */
    private unknownError: boolean = false;

    /**
     * Current form error
     */
    private formError?: string;

    /**
     * Snackbar duration
     */
    private readonly snackbarDuration: number = 2500;

    /**
     * Prevents subscribing to form changes multiple times (e.g. when reloading form)
     */
    private subscribedToFormSubscriptions: boolean = false;

    /**
    * Flag for initialization component, used because ngOnChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    public initialized = false;

    public get isInsertForm(): boolean {
        return this.config.isInsertForm;
    }

    public get isEditForm(): boolean {
        return this.config.isEditForm;
    }

    public get isDeleteEnabled(): boolean {
        if (this.config.deleteFunction) {
            return true;
        }
        return false;
    }

    /**
     * Translations
     */
    private translations = {
        'snackbar': {
            'deleted': '',
            'saved': '',
            'inserted': '',
        },
        'delete': {
            'messageGeneric': '',
            'cancel': '',
            'confirm': '',
            'title': '',
            'tooltip': '',
            'deleted': ''
        },
    };

    constructor(
        private snackbarService: MatSnackBar,
        private cdr: ChangeDetectorRef,
        private localizationService: LocalizationService,
        private dialogService: TdDialogService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.initDataForm();
    }

    ngOnChanges(): void {
        this.initDataForm();
    }

    handleDeleteItem(): void {
        // first confirm delete
        this.confirmDelete();
    }

    handleEditItem(): void {
        this.formActionSubject.next(DataFormActiomEnum.Edit);
    }

    handleInsertItem(): void {
        this.formActionSubject.next(DataFormActiomEnum.Insert);
    }

    reloadForm(): void {
        this.initForm();
    }

    private initDataForm(): void {
        if (!this.config || this.initialized) {
            return;
        }

        // mark component as initialized
        this.initialized = true;

        // init translations
        this.initTranslations();

        // subscribe to init form
        this.subscribeToInitForm();

        // init form
        this.initForm();
    }

    private getInitFormObservable(): Observable<void> {
        if (!this.config.formDefinition) {
            throw Error(`Could not init form because declaration of definition is missing`);
        }

        let xDefinition: DataFormEditDefinition | DataFormInsertDefinition;

        return this.config.formDefinition.flatMap(definition => {
            // prepare field observables
            const fieldObservables: Observable<void>[] = [];

            // clear fields
            this.clearFields();

            definition.fields.forEach(field => {
                fieldObservables.push(this.resolveField(field)
                    .map(resolvedField => {
                        // add resolved field to fields
                        this.fields.push(resolvedField);
                    }));
            });

            // zip all observables
            const fieldObservable = observableHelper.zipObservables(fieldObservables);

            // assign temp definition
            xDefinition = definition;

            return fieldObservable;
        })
            .map(() => {
                // at this point, all fields should be assigned to fields
                // create rows out of fields
                this.rows = this.getRows(this.fields);

                // init form group
                this.formGroup = this.toFormGroup(this.fields);

                // subscribe to form changes since form group is initialized
                if (!this.subscribedToFormSubscriptions) {
                    this.subscribeToFormChanges();

                    // subscribe to actions
                    this.subscribeToFormActions();

                    // make sure that subscription happens only once during the lifetime of component
                    this.subscribedToFormSubscriptions = true;
                } 

                // trigger form loaded event
                if (xDefinition instanceof DataFormEditDefinition) {
                    if (this.config.onEditFormLoaded) {
                        this.config.onEditFormLoaded(xDefinition);
                    }
                } else if (xDefinition instanceof DataFormInsertDefinition) {
                    if (this.config.onInsertFormLoaded) {
                        this.config.onInsertFormLoaded(xDefinition);
                    }
                } else {
                    throw Error(`Unsupported form definition response`);
                }

            });
    }

    private subscribeToInitForm(): void {
        this.initFormSubject
            .do(() => {
                if (this.config.enableLocalLoader) {
                    this.startLoader();
                }
            })
            .switchMap(() => this.getInitFormObservable())
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                if (this.config.enableLocalLoader) {
                    this.stopLoader();
                }
            },
            error => this.handleLoadError(error));
    }

    private checkTotalWidthOfRow(row: DataFormRow): void {
        const expectedWidth: number = 100;
        let totalWidth: number = 0;
        row.fields.forEach(field => totalWidth = totalWidth + (field.width ? field.width : 0));

        if (totalWidth !== expectedWidth) {
            console.warn(`Row '${row.rowNumber}' has fields with a total width of '${totalWidth}' while it should be '${expectedWidth}'`);
        }
    }

    private initForm() {
        this.initFormSubject.next(true);
    }

    private editItem(): Observable<DataFormEditResponse> {
        if (!this.config.saveFunction) {
            throw Error(`Form save function is not defined`);
        }

        return this.config.saveFunction(this.getFormValue())
            .map(response => {
                const editResponse = response;
                if (!(editResponse instanceof DataFormEditResponse)) {
                    throw Error(`Function expected edit response to be returned.`);
                }

                return editResponse;
            });
    }

    private confirmDelete(): void {
        this.dialogService.openConfirm({
            message: this.translations.delete.messageGeneric,
            disableClose: false, // defaults to false
            title: this.translations.delete.title,
            cancelButton: this.translations.delete.cancel,
            acceptButton: this.translations.delete.confirm,
        }).afterClosed()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((accept: boolean) => {
                if (accept) {
                    this.formActionSubject.next(DataFormActiomEnum.Delete);
                } else {
                    // user did not accepted delete
                }
            });
    }

    private deleteItem(): Observable<DataFormDeleteResponse> {
        if (!this.config.deleteFunction) {
            throw Error(`Form delete function is not defined`);
        }

        return this.config.deleteFunction(this.getFormValue())
            .map(response => {
                const deleteResponse = response;
                if (!(deleteResponse instanceof DataFormDeleteResponse)) {
                    throw Error(`Function expected delete response to be returned.`);
                }

                return deleteResponse;
            });
    }

    private insertItem(): Observable<DataFormInsertResponse> {
        if (!this.config.saveFunction) {
            throw Error(`Form save function is not defined`);
        }

        return this.config.saveFunction(this.getFormValue())
            .map(response => {
                const insertResponse = response;
                if (!(insertResponse instanceof DataFormInsertResponse)) {
                    throw Error(`Function expected insert response to be returned.`);
                }

                return insertResponse;
            });
    }

    private subscribeToFormActions(): void {
        let xType: DataFormActiomEnum;

        this.formActionSubject
            .do(() => {
                // start loader
                this.startLoader();

                // clear previous errors
                this.clearErrors();
            })
            .switchMap(type => {
                // remember type
                xType = type;

                if (type === DataFormActiomEnum.Delete) {

                    if (this.config.onBeforeDelete) {
                        this.config.onBeforeDelete(this.getFormValue());
                    }

                    return this.deleteItem().map(response => new ResponseWrapper(response));
                }

                if (this.config.onBeforeSave) {
                    this.config.onBeforeSave(this.getFormValue());
                }

                if (type === DataFormActiomEnum.Edit) {
                    return this.editItem().map(response => new ResponseWrapper(response));
                }

                if (type === DataFormActiomEnum.Insert) {
                    return this.insertItem().map(response => new ResponseWrapper(response));
                }

                throw Error(`Unsuported form action`);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(responseWrapper => {
                const response = responseWrapper.response;
                if (response instanceof DataFormInsertResponse) {
                    this.showSnackbarInsertMessage();

                    if (this.config.onAfterInsert) {
                        this.config.onAfterInsert(response);
                    }

                    if (this.config.clearFormAfterSave) {
                        this.clearForm();
                    }
                }
                if (response instanceof DataFormEditResponse) {
                    this.showSnackbarSaveMessage();

                    if (this.config.onAfterEdit) {
                        this.config.onAfterEdit(response);
                    }
                }
                if (response instanceof DataFormDeleteResponse) {
                    this.showSnackbarDeleteMessage();

                    if (this.config.onAfterDelete) {
                        this.config.onAfterDelete(response);
                    }
                }

                // stop loader
                this.stopLoader();
            },
            error => {
                this.handleSaveError(error);
            });
    }

    private getRows(fields: DataFormField[]): DataFormRow[] {
        const rows: DataFormRow[] = [];
        let defaultStartRowNumber: number = -1000;
        const defaultWidth: number = 100;
        const unsetRowNumber: number = -1;

        if (!fields) {
            return [];
        }

        const getRow = (rowNumber: number, width: number, createAsSeparateRow: boolean) => {
            const row = rows.find(m => m.rowNumber === rowNumber);
            if (!row) {
                const calculatedRowNumber = createAsSeparateRow ? defaultStartRowNumber : rowNumber;
                // row  does not exist, create it first
                const newRow = new DataFormRow(calculatedRowNumber);

                // insert new row
                rows.push(newRow);

                // increase the default start row if row was created separately
                if (createAsSeparateRow) {
                    defaultStartRowNumber++;
                }

                return newRow;
            }
            return row;
        };

        fields.forEach(field => {
            let row: DataFormRow;

            // do not add hidden fields to row
            if (field.fieldType === DataFormFieldTypeEnum.Hidden) {
                return;
            }

            if (!field.width || !field.rowNumber || unsetRowNumber === field.rowNumber) {
                // use default values because the row is not properly set
                row = getRow(defaultStartRowNumber, defaultWidth, true);
            } else {
                // get row using field values
                row = getRow(field.rowNumber, field.width, false);
            }

            // add field to row
            row.addField(field);
        });

        // check row widths
        rows.forEach(row => this.checkTotalWidthOfRow(row));

        // assign sections to rows
        this.config.sections.forEach(section => {
            // check if row with section index exists
            const row = rows.find(m => m.rowNumber === section.rowNumber);
            if (!row) {
                console.warn(`Could initialize section because row with number '${section.rowNumber}' was not found`);
            } else {
                row.addSection(section);
            }
        });

        // sort rows by row number
        return _.sortBy(rows, m => m.rowNumber);
    }

    private convertEmptyStringsToNull(): void {
        const formGroup = this.formGroup;
        if (!formGroup) {
            throw Error(`Form group is undefined`);
        }

        this.fields.forEach(question => {
            const formInput = formGroup.controls[question.key];

            if (formInput.value === '') {
                formInput.setValue(null);
            }
        });
    }

    private startLoader(): void {
        if (this.config.enableLocalLoader) {
            this.loaderEnabled = true;
        }
    }

    private stopLoader(): void {
        if (this.config.enableLocalLoader) {
            this.loaderEnabled = false;
        }
    }

    private initTranslations(): void {
        this.localizationService.get('webComponents.dataForm.snackbar.saved').map(text => this.translations.snackbar.saved = text)
            .zip(this.localizationService.get('webComponents.dataForm.snackbar.deleted').map(text => this.translations.snackbar.deleted = text))
            .zip(this.localizationService.get('webComponents.dataForm.snackbar.inserted').map(text => this.translations.snackbar.inserted = text))
            .zip(this.localizationService.get('webComponents.dataForm.delete.messageGeneric').map(text => this.translations.delete.messageGeneric = text))
            .zip(this.localizationService.get('webComponents.dataForm.delete.title').map(text => this.translations.delete.title = text))
            .zip(this.localizationService.get('webComponents.dataForm.delete.cancel').map(text => this.translations.delete.cancel = text))
            .zip(this.localizationService.get('webComponents.dataForm.delete.confirm').map(text => this.translations.delete.confirm = text))
            .zip(this.localizationService.get('webComponents.dataForm.delete.tooltip').map(text => this.translations.delete.tooltip = text))
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private getFormValue(): Object {
        // convert empty string to null
        // this prevent some issue when saving data on server
        this.convertEmptyStringsToNull();

        return this.formGroup ? this.formGroup.value : undefined;
    }

    private subscribeToFormChanges(): void {
        if (!this.formGroup) {
            throw Error(`Could not subscribe to form value changes`);
        }
        this.formGroup.valueChanges
            .map(changes => {
                // trigger events
                this.formValueChangeSubject.next(changes);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => this.handleFormChange());

        this.formGroup.statusChanges
            .map(status => {
                // trigger events
                this.formStatusChangeSubject.next(status === 'VALID');
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private resolveField(field: DataFormField): Observable<DataFormField> {
        // resolve field using custom values
        if (!this.config.fieldValueResolver) {
            return Observable.of(field);
        }

        return this.config.fieldValueResolver(field.key, field.value)
            .map(newValue => {
                const resolvedValue = this.getFieldValueSetByResolver(newValue);

                // set field value
                field.value = resolvedValue;

                // do not 'change default value' as this is overwrite
                // field.defaultValue = resolvedValue;

                // return resolved field
                return field;
            });
    }

    private clearForm(): void {
        if (!this.config.isInsertForm) {
            throw Error(`Only insert forms can be cleared after save`);
        }
        this.initForm();
    }

    private handleLoadError(error): void {
        console.error(error);
        this.errorLoadingForm = true;

        this.stopLoader();
    }

    private handleSaveError(error): void {
        console.error(error);
        this.unknownError = true;

        if (this.config.onError) {
            this.config.onError(error);
        }

        // re-subscribe to button clicks because error unsubscribes from the observable
        this.subscribeToFormActions();

        this.stopLoader();
    }

    private handleFormChange(): void {
        // remove error message when any input in form changes
        this.formError = undefined;
    }

    private clearFields(): void {
        this.fields = [];
    }

    private clearErrors(): void {
        this.errorLoadingForm = false;
        this.formError = undefined;
        this.unknownError = false;
    }

    private showSnackbarMessage(message: string): void {
        this.snackbarService.open(message, '', { duration: this.snackbarDuration });
    }

    private showSnackbarSaveMessage(): void {
        this.showSnackbarMessage(this.translations.snackbar.saved);
    }

    private showSnackbarDeleteMessage(): void {
        this.showSnackbarMessage(this.translations.snackbar.deleted);
    }

    private showSnackbarInsertMessage(): void {
        this.showSnackbarMessage(this.translations.snackbar.inserted);
    }

    /**
     * Gets form group out of fields
     * @param fields Fields
     */
    private toFormGroup(fields: DataFormField[]): FormGroup {
        const group: any = {};

        if (fields) {
            fields.forEach(field => {
                group[field.key] = field.required ? new FormControl(field.value, Validators.required)
                    : new FormControl(field.value);
            });
        }

        return new FormGroup(group);
    }

    /**
     * Use to manually set value of certain field in form.
     * @param fields all fields in form
     * @param fieldName Name of field
     * @param value Value
     */
    private getFieldValueSetByResolver(value: string | boolean | number | Date): string {
        // boolean field needs to return 'string' with 'false' value otherwise the JSON .NET mapping
        // does not map the object
        if (!value) {
            if (typeof (value) === 'boolean') {
                return 'false';
            }
            return '';
        }

        return value.toString().trim();
    }
}

class DataFormRow {

    public fields: DataFormField[] = [];
    public section?: DataFormSection;

    constructor(
        public rowNumber: number,
    ) {
    }

    addField(field: DataFormField): void {
        this.fields.push(field);
    }
    addSection(section: DataFormSection): void {
        this.section = section;
    }

    isSmallSection(): boolean {
        if (!this.section) {
            return false;
        }

        return this.section.size === DataFormSectionSize.Small;
    }

    isMediumSection(): boolean {
        if (!this.section) {
            return false;
        }

        return this.section.size === DataFormSectionSize.Medium;
    }

    isLargeSection(): boolean {
        if (!this.section) {
            return false;
        }

        return this.section.size === DataFormSectionSize.Large;
    }
}

class ResponseWrapper {
    constructor(
        public response: DataFormEditResponse | DataFormDeleteResponse | DataFormInsertResponse
    ) { }
}

