import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TdDialogService } from '@covalent/core';
import { Observable, Subject } from 'rxjs/Rx';
import * as _ from 'underscore';

import { LocalizationService } from '../../lib/localization';
import { observableHelper, numberHelper, booleanHelper, stringHelper } from '../../lib/utilities';
import { BaseWebComponent } from '../base-web-component.class';
import {
    DataFormDeleteResponse,
    DataFormEditDefinition,
    DataFormEditResponse,
    DataFormError,
    DataFormField,
    DataFormInsertDefinition,
    DataFormInsertResponse,
    DataFormSection,
} from './data-form-models';
import { DataFormConfig } from './data-form.config';
import { DataFormActiomEnum, DataFormFieldTypeEnum, DataFormSectionSize } from './data-form.enums';

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
     * Fields
     */
    public fields: DataFormField[] = [];

    /**
     * Indicates if there is a problem with loading form
     */
    public errorLoadingForm: boolean = false;

    /**
     * Indicates if unknown error occured
     */
    public unknownError: boolean = false;

    /**
     * Current form error
     */
    public formError?: string;

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
        if (this.config.deleteFunction && this.config.enableDelete) {
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
        this.loadForm();
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
        this.loadForm();
    }

    private getInitFormObservable(): Observable<void> {
        if (!this.config.formDefinition) {
            throw Error(`Could not init form because declaration of definition is missing`);
        }

        let xDefinition: DataFormEditDefinition<any> | DataFormInsertDefinition;

        return this.config.formDefinition.flatMap(definition => {
            // prepare field observables
            const fieldObservables: Observable<void>[] = [];

            // prepare item (if available)
            let item: any | undefined;
            if (definition instanceof DataFormEditDefinition) {
                item = definition.item;
            }

            // clear fields
            this.clearFields();

            definition.fields.forEach(field => {
                // ignore fields
                if (!this.config.ignoreFields.find(m => m === field.key)) {
                    // this means that field is not in the ignore list
                    // pass item to field so that its accessible easily
                    field.internalProperties.item = item;

                    fieldObservables.push(this.resolveField(field, item)
                        .map(resolvedField => {
                            // add resolved field to fields
                            this.fields.push(resolvedField);
                        }));
                }

            });

            // zip all observables
            const fieldObservable = observableHelper.zipObservables(fieldObservables);

            // assign temp definition
            xDefinition = definition;

            return fieldObservable;
        })
            .map(() => {
                // at this point, all fields should be ready
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


                // this is important as it prevents issues when multiple fields were changed
                // using e.g. field value resolver. This change could edit field that was already checked and since
                // all fields are passed to datafield it would cause an error
                this.cdr.detectChanges();
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

    private loadForm() {
        this.initFormSubject.next(true);
    }

    private editItem(): Observable<DataFormEditResponse<any>> {
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

    private insertItem(): Observable<DataFormInsertResponse<any>> {
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

    private resolveField(field: DataFormField, item: any | undefined): Observable<DataFormField> {
        if (!this.config.configField) {
            return Observable.of(field);
        }

        return this.config.configField(field, item).map(resolvedField => {
            // make sure the value is set properly
            resolvedField.value = this.getFieldValueSetByResolver(resolvedField.value);
            resolvedField.defaultValue = this.getFieldValueSetByResolver(resolvedField.defaultValue);

            return resolvedField;
        });
    }

    private clearForm(): void {
        if (!this.config.isInsertForm) {
            throw Error(`Only insert forms can be cleared after save`);
        }
        this.loadForm();
    }

    private handleLoadError(error: DataFormError | any): void {
        console.error(error);
        if (error instanceof DataFormError) {

            if (this.config.onError) {
                this.config.onError(error.originalError);
            }

            this.resolveErrorMessage(error);
        } else {
            if (this.config.onError) {
                this.config.onError(error);
            }

        }

        this.errorLoadingForm = true;
        this.stopLoader();
    }

    private handleSaveError(error: DataFormError | any): void {
        console.error(error);

        if (this.config.onError) {
            this.config.onError(error);
        }

        if (error instanceof DataFormError) {
            this.resolveErrorMessage(error);
        } else {
            this.unknownError = true;
        }

        // re-subscribe to button clicks because error unsubscribes from the observable
        this.subscribeToFormActions();

        this.stopLoader();
    }

    private resolveErrorMessage(error: DataFormError): void {
        const translationData: any = {};
        const extraTranslations: Observable<string>[] = [];
        if (error.dataToTranslate) {
            error.dataToTranslate.forEach(item => {
                // translate and assign data
                extraTranslations.push(this.localizationService.get(item.value).map(text => translationData[item.name] = text));
            });
        }

        // resolve translations
        const translationObs = extraTranslations && extraTranslations.length > 0
            ? observableHelper.zipObservables(extraTranslations)
            : Observable.of(undefined);

        translationObs
            .flatMap(() => {
                // at this point all extra translation should be resolved
                // resolve primary error message
                return this.localizationService.get(error.translationKey, translationData);
            })
            .map(errorMessage => {
                // we have a complete error message here
                this.formError = errorMessage;
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
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
    private getFieldValueSetByResolver(value: string | boolean | number | Date | object | undefined): boolean | string | number | Date | object | undefined {
        // boolean field needs to return 'string' with 'false' value otherwise the JSON .NET mapping
        // does not map the object
        if (!value) {
            if (typeof (value) === 'boolean') {
                return 'false';
            }
            return '';
        }

        if (numberHelper.isNumber(value)) {
            return +value;
        }

        if (stringHelper.isString(value)) {
            return value.toString().trim();
        }

        return value;
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
        public response: DataFormEditResponse<any> | DataFormDeleteResponse | DataFormInsertResponse<any>
    ) { }
}
