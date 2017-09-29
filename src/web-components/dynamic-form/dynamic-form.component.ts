// Core 
import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { Observable, Subject } from 'rxjs/Rx';

// models
import { FormConfig } from './form-config.class';

import { BaseWebComponent } from '../base-web-component.class';
import {
    ColumnValidation, FieldErrorEnum, ResponseCreate, ResponseEdit, FormErrorResponse,
    ErrorResponse, ErrorReasonEnum, FormField, ResponseDelete
} from '../../lib/repository';

// services
import { TranslateService } from '@ngx-translate/core';
import { FieldControlService } from './field-control.service';

//helpers
import { observableHelper } from '../../lib/utilities';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details about dynamic forms
@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    providers: [FieldControlService]
})
export class DynamicFormComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Why use subject for on click events? 
     * => Because we want to cancel requests if new request comes before the old one returns value (can happen
     * when clicking submit very fast)
     * More info: https://github.com/angular/angular/issues/5876 -> response from 'robwormald commented on Dec 30, 2015'
     */
    private insertButtonSubject: Subject<void>;
    private editButtonSubject: Subject<void>;
    private deleteButtonSubject: Subject<void>;

    private insufficientLicenseError: string;
    private generalErrorMessage: string;
    private unknownErrorMessage: string;

    private questions: FormField[] = [];

    private deleteText: string;
    private submitText: string;
    private snackbarText: string;
    private deleteSnackbarText: string;
    private savedText: string;

    public response: any;

    private form: FormGroup;

    private submissionError: string;

    private formErrorLines: string[] = [];

    private isDeleteEnabled: boolean = false;
    private isEditForm: boolean = false;
    private isInsertForm: boolean = false;

    // inputs
    @Input() config: FormConfig<any>;

    constructor(
        private fieldControlService: FieldControlService,
        private snackBarService: MdSnackBar,
        private translateService: TranslateService,
        private cdr: ChangeDetectorRef
    ) {
        super()
    }

    ngOnInit() {
        if (this.config) {
            this.initDynamicForm(this.config);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // re-initalize form when questions changes because dynamic form may recieve config with questions 
        // after the initilization of component 
        if (changes.config && changes.config.currentValue) {
            this.initDynamicForm(changes.config.currentValue);
        }
    }

    private initDynamicForm(config: FormConfig<any>): void {
        // try to initialize component if config is available during init
        if (config) {
            // !! Important - unsubscribe from buttons. If dynamic form is reloaded within the same page, it may happen
            // that clicking save will fire multiple times
            this.initButtons();

            if (config.onBeforeFormInit) {
                config.onBeforeFormInit();
            }

            // subscribe to button events
            this.initButtonClicks(config);

            // form type
            this.isDeleteEnabled = this.deleteIsEnabled(config);
            this.isEditForm = config.isEditForm();
            this.isInsertForm = config.isInsertForm();

            var translateLabelsObservable = this.getTranslateLabelsObservable(config);

            // init fields
            this.getInitFormObservable(config)
                .takeUntil(this.ngUnsubscribe)
                .zip(translateLabelsObservable)
                .subscribe(() => {
                    // form initialized
                })
        }

        // should be necessary, delete if all is working fine
        //this.cdr.detectChanges();
    }

    private getInitFormObservable(config: FormConfig<any>): Observable<any> {

        if (config.isInsertForm()) {
            if (!config.insertFormDefinition) {
                throw Error(`Cannot init 'insert' form because no form definition was provided`);
            }

            return config.insertFormDefinition
                .map(form => {
                    var fields = form.fields;

                    if (config.fieldValueResolver && fields && fields.length > 0) {
                        // resolve custom field values
                        if (config.fieldValueResolver) {
                            // got through all fields and try resolving their value through custom resolver
                            fields.forEach(field => {
                                var newValue = config.fieldValueResolver(field.key, field.value);
                                field.value = this.getFieldValueSetByResolver(newValue);
                            })
                        }
                    }

                    // load fields
                    this.form = this.fieldControlService.toFormGroup(fields);

                    // assign questions from fields
                    this.assignQuestions(fields);

                    // subscribe to form changes
                    this.form.valueChanges
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(response => this.handleFormChange());

                    // form loaded
                    if (config.onInsertFormLoaded) {
                        config.onInsertFormLoaded(form);
                    }
                });
        }
        else if (config.isEditForm()) {
            if (!config.editFormDefinition) {
                throw Error(`Cannot init 'edit' form because no form definition was provided`);
            }
            return config.editFormDefinition
                .map(form => {
                    var fields = form.fields;

                    // load fields
                    this.form = this.fieldControlService.toFormGroup(fields);

                    // assign questions from fields
                    this.assignQuestions(fields);

                    // resolve custom field values
                    if (config.fieldValueResolver && fields && fields.length > 0) {
                        if (config.fieldValueResolver) {
                            // got through all fields and try resolving their value through custom resolver
                            fields.forEach(field => {
                                var newValue = config.fieldValueResolver(field.key, field.value);
                                field.value = this.getFieldValueSetByResolver(newValue);
                            })
                        }
                    }

                    // subscribe to form changes
                    this.form.valueChanges
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(response => this.handleFormChange());

                    // after init
                    if (config.onEditFormLoaded) {
                        config.onEditFormLoaded(form);
                    }
                })
        }
        throw Error(`Unsupported form type`);
    }

    private initButtonClicks(config: FormConfig<any>) {
        if (config.isInsertForm()) {
            this.insertButtonSubject
                .takeUntil(this.ngUnsubscribe)
                .switchMap(event => {
                    if (!config.insertFunction) {
                        throw new Error('Insert function is not defined');
                    }

                    // start loader
                    this.startLoader(config);

                    // before save
                    if (config.onBeforeSave) {
                        config.onBeforeSave();
                    }

                    // do not allow nulls to be send
                    this.convertEmptyStringsToNull();

                    return config.insertFunction(this.form.value)
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleInsertAfter(config, response);

                    // after save
                    if (config.OnAfterSave) {
                        config.OnAfterSave();
                    }

                    // stop loader
                    this.stopLoader(config);

                    // form clear
                    this.handleFormClear(config);
                },
                (err) => {
                    this.handleError(config, err);
                });
        }
        else if (config.isEditForm()) {
            this.editButtonSubject
                .takeUntil(this.ngUnsubscribe)
                .switchMap(event => {
                    if (!config.editFunction) {
                        throw new Error('Edit function is not defined');
                    }

                    // start loader
                    this.startLoader(config);

                    // before save
                    if (config.onBeforeSave) {
                        config.onBeforeSave();
                    }

                    // do not allow nulls to be send
                    this.convertEmptyStringsToNull();

                    return config.editFunction(this.form.value)
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleUpdateAfter(config, response);

                    // after save
                    if (config.OnAfterSave) {
                        config.OnAfterSave();
                    }

                    // stop loader
                    this.stopLoader(config);
                },
                (err) => {
                    this.handleError(config, err);
                });
        }
        else {
            throw Error('Form does not support given save option');
        }

        if (this.deleteIsEnabled(config)) {
            if (!config.deleteFunction) {
                throw Error(`Cannot init delete function because it wasn't supplied`);
            }

            this.deleteButtonSubject
                .takeUntil(this.ngUnsubscribe)
                .switchMap(response => {
                    if (!config.deleteFunction) {
                        throw new Error('Delete function is not defined');
                    }

                    // start loader
                    this.startLoader(config);

                    // before delete
                    if (config.onBeforeDelete) {
                        config.onBeforeDelete(this.form.value);
                    }
                    this.convertEmptyStringsToNull();

                    return config.deleteFunction(this.form.value)
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleDeleteAfter(config, response);

                    // stop loader
                    this.stopLoader(config);
                },
                (err) => {
                    this.handleError(config, err);
                });
        }
    }

    private initButtons(): void {
        this.insertButtonSubject = new Subject<void>();
        this.deleteButtonSubject = new Subject<void>();
        this.editButtonSubject = new Subject<void>();
    }

    private deleteIsEnabled(config: FormConfig<any>): boolean {
        if (config.enableDelete && config.deleteFunction) {
            return true;
        }
        return false;
    }

    private assignQuestions(fields: FormField[]): void {
        if (!fields) {
            return;
        }

        var tempQuestions: FormField[] = [];

        fields.forEach(field => {
            if (this.showField(field.key)) {
                tempQuestions.push(field);
            }
        });

        this.questions = tempQuestions;
    }

    /**
     * Determins whether the form field will be shown on form
     * @param key Name of the field
     */
    private showField(key: string): boolean {

        var fieldInHiddenFields = this.config.hiddenFields.find(m => m === key);

        if (fieldInHiddenFields) {
            return false;
        }
        return true;
    }

    private getTranslateLabelsObservable(config: FormConfig<any>): Observable<any> {
        var observables: Observable<any>[] = [];

        observables.push(this.translateService.get(config.submitTextKey).map(key => this.submitText = key));
        observables.push(this.translateService.get(config.snackBarTextKey).map(key => this.snackbarText = key));
        observables.push(this.translateService.get(config.deleteSnackBarTextKey).map(key => this.deleteSnackbarText = key));
        observables.push(this.translateService.get(config.deleteTextKey).map(key => this.deleteText = key));

        observables.push(this.translateService.get('form.error.insufficientLicense').map(key => this.insufficientLicenseError = key));
        observables.push(this.translateService.get('form.error.saveFailed').map(key => this.generalErrorMessage = key));
        observables.push(this.translateService.get('form.error.unknownFormErrorMessage').map(key => this.unknownErrorMessage = key));

        return observableHelper.zipObservables(observables);
    }

    private startLoader(config: FormConfig<any>): void {
        if (config.loaderConfig) {
            config.loaderConfig.start();
        }
    }

    private stopLoader(config: FormConfig<any>): void {
        if (config.loaderConfig) {
            config.loaderConfig.stop();
        }
    }

    private handleFormChange(): void {
        // remove error message when any input in form changes
        this.submissionError = '';
        this.formErrorLines = [];

        // detect changes manually when changing values used in template!
        this.cdr.detectChanges();
    }

    private handleSnackBar(config: FormConfig<any>, ): void {
        if (this.config.showSnackBar) {
            this.snackBarService.open(this.snackbarText, '', { duration: 2500 });
        }
    }

    private handleDeleteSnackBar(config: FormConfig<any>, ): void {
        if (this.config.showSnackBar) {
            this.snackBarService.open(this.deleteSnackbarText, '', { duration: 2500 });
        }
    }

    private handleDeleteAfter(config: FormConfig<any>, response: ResponseDelete): void {
        this.handleDeleteSnackBar(config);

        if (config.onAfterDelete) {
            config.onAfterDelete(response);
        }
    }

    private handleUpdateAfter(config: FormConfig<any>, response: ResponseEdit<any>): void {
        this.handleSnackBar(config);

        if (this.config.onAfterUpdate) {
            this.config.onAfterUpdate(response);
        }
    }

    private handleInsertAfter(config: FormConfig<any>, response: ResponseCreate<any>): void {
        this.handleSnackBar(config);

        if (this.config.onAfterInsert) {
            this.config.onAfterInsert(response);
        }
    }

    private handleFormClear(config: FormConfig<any>): void {
        // only insert forms can be cleared after save
        if (this.config.clearFormAfterSave && this.config.isInsertForm()) {
            this.questions = [];
            this.initDynamicForm(this.config);
        }
    }

    private convertEmptyStringsToNull(): void {
        this.questions.forEach(question => {
            var formInput = this.form.controls[question.key];

            if (formInput.value === '') {
                formInput.setValue(null);
            }
        });
    }

    private handleError(config: FormConfig<any>, errorResponse: ErrorResponse | FormErrorResponse | any): void {
        if (this.config.onError) {
            this.config.onError(errorResponse);
        }

        if (errorResponse instanceof FormErrorResponse) {
            // handle form errors without validation result
            if (!errorResponse.formValidation.validationResult || errorResponse.formValidation.validationResult.length === 0) {
                this.submissionError = this.unknownErrorMessage;
                return;
            }

            // handle invalid field errors
            errorResponse.formValidation.validationResult.forEach(validationResult => {

                this.getFormFieldErrorMessage(validationResult).subscribe(error => {
                    var fieldWithError = this.form.controls[validationResult.columnName];

                    if (!fieldWithError) {
                        // field can be undefined if its not present in form - e.g. codename might throw error, but is
                        // typically not in the form
                        this.formErrorLines.push(error);
                    }
                    else {
                        // set field error
                        this.form.controls[validationResult.columnName].setErrors({ 'field_error': error });

                        // get translated label of the form field
                        var formField = this.questions.find(m => m.key.toLowerCase() === validationResult.columnName.toLocaleLowerCase());

                        if (formField) {
                            // form error
                            this.getFormErrorMessage(validationResult, formField.translatedLabel || formField.key).subscribe(error => this.formErrorLines.push(error))
                        }
                        else {
                            console.warn(`Form field '${validationResult.columnName}' could not be found in form and therefore error message could not be displayed`);
                        }
                    }
                });
            });
            this.submissionError = this.formErrorLines.join(', ');
        }
        else if (errorResponse instanceof ErrorResponse) {
            // handle license errors differently
            if (errorResponse.reason === ErrorReasonEnum.LicenseLimitation) {
                this.submissionError = this.insufficientLicenseError;
            }
            else {
                this.submissionError = this.generalErrorMessage;
            }
        }
        else {
            this.submissionError = this.unknownErrorMessage;
        }

        // buttons clicks need to be reinitialized because otherwise it was not possible to resubmit the form 
        // after it failed because of some error
        this.initButtonClicks(config);

        // stop loader on error in case the request is pending
        this.stopLoader(config);
    }

    private getFormErrorMessage(columnValidation: ColumnValidation, fieldLabel: string): Observable<string> {
        return this.getFormFieldErrorMessage(columnValidation, fieldLabel);
    }

    private getFormFieldErrorMessage(columnValidation: ColumnValidation, fieldLabel?: string): Observable<string> {
        if (columnValidation.errorType === FieldErrorEnum.InvalidCodename) {
            if (fieldLabel) {
                return this.translateService.get('form.error.invalidCodenameWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.invalidCodename');
        }

        if (columnValidation.errorType === FieldErrorEnum.InvalidEmail) {
            if (fieldLabel) {
                return this.translateService.get('form.error.invalidEmailWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.invalidEmail');
        }

        if (columnValidation.errorType === FieldErrorEnum.NotUnique) {
            if (fieldLabel) {
                return this.translateService.get('form.error.notUniqueWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.notUnique');
        }

        if (columnValidation.errorType === FieldErrorEnum.NotEditable) {
            if (fieldLabel) {
                return this.translateService.get('form.error.notEditableWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.notEditable');
        }

        if (columnValidation.errorType === FieldErrorEnum.Other) {
            if (fieldLabel) {
                return this.translateService.get('form.error.otherWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.other');
        }

        return this.translateService.get('form.error.unknownn');
    }

    /**
     * Use to manually set value of certain field in form.
     * Call after all fields were initiliazed
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