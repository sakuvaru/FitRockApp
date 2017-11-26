import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs/Rx';

// common
import { BaseWebComponent } from '../base-web-component.class';

// data form 
import { DataFormConfig } from './data-form.config';
import { DataFormActiomEnum } from './data-form-action.enum';
import {
    DataFormDeleteResponse, DataFormEditDefinition, DataFormEditResponse, DataFormField,
    DataFormInsertDefinition, DataFormInsertResponse
} from './data-form-models';

// additional services
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';
import { observableHelper } from '../../lib/utilities';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'data-form',
    templateUrl: 'data-form.component.html'
})
export class DataFormComponent extends BaseWebComponent implements OnInit, OnChanges {

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
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = false;

    /**
     * Form group
     */
    public formGroup?: FormGroup;

    /**
     * Currently used fields
     */
    public fields: DataFormField[] = [];

    /**
     * Temp fields
     */
    private tempFields: DataFormField[] = [];

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
            'inserted': ''
        }
    };

    constructor(
        private snackbarService: MatSnackBar,
        private translateService: TranslateService
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
        this.formActionSubject.next(DataFormActiomEnum.Delete);
    }

    handleEditItem(): void {
        this.formActionSubject.next(DataFormActiomEnum.Edit);
    }

    handleInsertItem(): void {
        this.formActionSubject.next(DataFormActiomEnum.Insert);
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

            definition.fields.forEach(field => {
                fieldObservables.push(this.resolveField(field)
                    .map(resolvedField => {
                        // add resolved field to temporary fields
                        this.tempFields.push(resolvedField);
                    }));
            });

            // zip all observables
            const fieldObservable = observableHelper.zipObservables(fieldObservables);

            // assign temp definition
            xDefinition = definition;

            return fieldObservable;
        })
            .map(() => {
                // at this point, all fields should be assigned to temp fields
                // reassign fields to their property and clear temp fields
                this.fields = this.tempFields;
                this.clearTempFields();

                // init form group
                this.formGroup = this.toFormGroup(this.fields);

                // subscribe to form changes since form group is initialized
                this.subscribeToFormChanges();

                // subscribe to actions
                this.subscribeToFormActions();

                // trigger form loaded event
                if (this.config.onFormLoaded) {
                    this.config.onFormLoaded(xDefinition);
                }
            });

    }

    private subscribeToInitForm(): void {
        this.initFormSubject.switchMap(() => this.getInitFormObservable())
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
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

                    return this.deleteItem();
                }

                if (this.config.onBeforeSave) {
                    this.config.onBeforeSave(this.getFormValue());
                }

                if (type === DataFormActiomEnum.Edit) {
                    return this.editItem();
                }

                if (type === DataFormActiomEnum.Insert) {
                    return this.insertItem();
                }

                throw Error(`Unsuported form action`);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => {
                if (response instanceof DataFormInsertResponse) {
                    this.showSnackbarInsertMessage();

                    if (this.config.onAfterSave) {
                        this.config.onAfterSave(response);
                    }

                    if (this.config.clearFormAfterSave) {
                        this.clearForm();
                    }
                }
                if (response instanceof DataFormEditResponse) {
                    this.showSnackbarSaveMessage();

                    if (this.config.onAfterSave) {
                        this.config.onAfterSave(response);
                    }

                    if (this.config.clearFormAfterSave) {
                        this.clearForm();
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
        this.translateService.get('webComponents.dataForm.snackbar.saved').map(text => this.translations.snackbar.saved = text)
            .zip(this.translateService.get('webComponents.dataForm.snackbar.deleted').map(text => this.translations.snackbar.deleted = text))
            .zip(this.translateService.get('webComponents.dataForm.snackbar.inserted').map(text => this.translations.snackbar.inserted = text))
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
            throw Error(`Could not subscribe to form changes`);
        }
        this.formGroup.valueChanges
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => this.handleFormChange());
    }

    private resolveField(field: DataFormField): Observable<DataFormField> {
        // resolve field using custom values
        if (!this.config.fieldValueResolver) {
            return Observable.of(field);
        }

        return this.config.fieldValueResolver(field.key, field.value)
            .map(newValue => {
                field.value = this.getFieldValueSetByResolver(newValue);

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

        this.stopLoader();
    }

    private handleFormChange(): void {
        // remove error message when any input in form changes
        this.formError = undefined;
    }

    private clearTempFields(): void {
        this.tempFields = [];
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
            fields.forEach(question => {
                group[question.key] = question.required ? new FormControl(question.value, Validators.required)
                    : new FormControl(question.value);
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
    private getFieldValueSetByResolver(value: string | boolean | number): string {
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
