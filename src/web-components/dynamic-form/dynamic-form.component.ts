import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldControlService } from './field-control.service';
import { FormConfig } from './form-config.class';
import { MdSnackBar } from '@angular/material';
import {
    ColumnValidation, FieldErrorEnum, ResponseCreate, ResponseEdit, FormErrorResponse,
    ErrorResponse, ErrorReasonEnum, FormField, ResponseDelete
} from '../../lib/repository';
import { TranslateService } from '@ngx-translate/core';
import { BaseWebComponent } from '../base-web-component.class';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

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
    ) { super()
    }

    ngOnInit() {
        this.initDynamicForm(this.config);
    }

    initDynamicForm(config: FormConfig<any>): void {
        // try to initialize component if config is available during init
        if (this.config) {
            // !! Important - unsubscribe from buttons. If dynamic form is reloaded within the same page, it may happen
            // that clicking save will fire multiple times
            this.insertButtonSubject = new Subject<void>();
            this.deleteButtonSubject = new Subject<void>();
            this.editButtonSubject = new Subject<void>();

            this.config = config;

            if (this.config.onFormInit) {
                this.config.onFormInit();
            }

            // subscribe to button events
            this.initButtonClicks();
            
            // load fields
            this.form = this.fieldControlService.toFormGroup(this.config.fields);

            // assign questions from fields
            this.assignQuestions(this.config.fields)

            // subscribe to form changes
            this.form.valueChanges
                .takeUntil(this.ngUnsubscribe)
                .subscribe(response => this.handleFormChange());

            // translate labels
            this.translateLabels();

            // form type
            this.isDeleteEnabled = this.deleteIsEnabled();
            this.isEditForm = this.config.isEditForm();
            this.isInsertForm = this.config.isInsertForm();

            // after init
            if (this.config.onFormLoaded){
                this.config.onFormLoaded();
            }
        }

        this.cdr.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges ) {
        // re-initalize form when questions changes because dynamic form may recieve config with questions 
        // after the initilization of component 
        if (changes.config && changes.config.currentValue) {
            this.initDynamicForm(changes.config.currentValue);
        }
    }

    initButtonClicks() {
        if (this.config.isInsertForm()) {
            this.insertButtonSubject
                .takeUntil(this.ngUnsubscribe)
                .switchMap(event => {
                    if (!this.config.insertFunction){
                        throw new Error('Insert function is not defined');
                    }

                    // start loader
                    this.startLoader();

                    // before save
                    if (this.config.onBeforeSave) {
                        this.config.onBeforeSave();
                    }

                    // do not allow nulls to be send
                    this.convertEmptyStringsToNull();

                    return this.config.insertFunction(this.form.value)
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleInsertAfter(response);

                    // after save
                    if (this.config.OnAfterSave) {
                        this.config.OnAfterSave();
                    }

                    // stop loader
                    this.stopLoader();
                },
                (err) => {
                    this.handleError(err);
                });
        }
        else if (this.config.isEditForm()) {
            this.editButtonSubject
                .takeUntil(this.ngUnsubscribe)
                .switchMap(event => {
                    if (!this.config.editFunction){
                        throw new Error('Edit function is not defined');
                    }

                    // start loader
                    this.startLoader();

                    // before save
                    if (this.config.onBeforeSave) {
                        this.config.onBeforeSave();
                    }

                    // do not allow nulls to be send
                    this.convertEmptyStringsToNull();

                    return this.config.editFunction(this.form.value)
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleUpdateAfter(response);

                    // after save
                    if (this.config.OnAfterSave) {
                        this.config.OnAfterSave();
                    }

                    // stop loader
                    this.stopLoader();
                },
                (err) => {
                    this.handleError(err);
                });
        }
        else {
            throw Error('Form does not support given save option');
        }

        if (this.deleteIsEnabled()) {
            if (!this.config.deleteFunction) {
                throw Error(`Cannot init delete function because it wasn't supplied`);
            }

            this.deleteButtonSubject
                .takeUntil(this.ngUnsubscribe)
                .switchMap(response => {
                    if (!this.config.deleteFunction){
                        throw new Error('Delete function is not defined');
                    }

                    // start loader
                    this.startLoader();

                    // before delete
                    if (this.config.onBeforeDelete) {
                        this.config.onBeforeDelete(this.form.value);
                    }
                    this.convertEmptyStringsToNull();

                    return this.config.deleteFunction(this.form.value)
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleDeleteAfter(response);

                    // stop loader
                    this.stopLoader();
                },
                (err) => {
                    this.handleError(err);
                });
        }
    }

    private deleteIsEnabled(): boolean{
        if( this.config.enableDelete && this.config.deleteFunction){
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

        if (fieldInHiddenFields){
            return false;
        }
        return true;
    }

    private translateLabels(): void {
        this.translateService.get(this.config.submitTextKey).subscribe(key => this.submitText = key);
        this.translateService.get(this.config.snackBarTextKey).subscribe(key => this.snackbarText = key);
        this.translateService.get(this.config.deleteSnackBarTextKey).subscribe(key => this.deleteSnackbarText = key);
        this.translateService.get(this.config.deleteTextKey).subscribe(key => this.deleteText = key);

        this.translateService.get('form.error.insufficientLicense').subscribe(key => this.insufficientLicenseError = key);
        this.translateService.get('form.error.saveFailed').subscribe(key => this.generalErrorMessage = key);
        this.translateService.get('form.error.unknownFormErrorMessage').subscribe(key => this.unknownErrorMessage = key);
    }

    private startLoader(): void {
        if (this.config.loaderConfig){
            this.config.loaderConfig.start();
        }
    }

    private stopLoader(): void {
        if (this.config.loaderConfig){
            this.config.loaderConfig.stop();
        }
    }

    private handleFormChange(): void {
        // remove error message when any input in form changes
        this.submissionError = '';
        this.formErrorLines = [];

        // detect changes manually when changing values used in template!
        this.cdr.detectChanges();
    }

    private handleSnackBar(): void {
        if (this.config.showSnackBar) {
            this.snackBarService.open(this.snackbarText, '', { duration: 2500 });
        }
    }

    private handleDeleteSnackBar(): void {
        if (this.config.showSnackBar) {
            this.snackBarService.open(this.deleteSnackbarText, '', { duration: 2500 });
        }
    }

    private handleDeleteAfter(response: ResponseDelete): void {
        this.handleDeleteSnackBar();

        if (this.config.onAfterDelete) {
            this.config.onAfterDelete(response);
        }
    }

    private handleUpdateAfter(response: ResponseEdit<any>): void {
        this.handleSnackBar();

        // only insert forms can be cleared after save
        if (this.config.clearFormAfterSave && this.config.isInsertForm()){
            this.initDynamicForm(this.config);
         }

        if (this.config.onAfterUpdate) {
            this.config.onAfterUpdate(response);
        }
    }

    private handleInsertAfter(response: ResponseCreate<any>): void {
        this.handleSnackBar();

        if (this.config.clearFormAfterSave){
           this.initDynamicForm(this.config);
        }

        if (this.config.onAfterInsert) {
            this.config.onAfterInsert(response);
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

    private handleError(errorResponse: ErrorResponse | FormErrorResponse | any): void {
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

                        if (formField){
                            // form error
                            this.getFormErrorMessage(validationResult, formField.translatedLabel || formField.key).subscribe(error => this.formErrorLines.push(error))
                        }
                        else{
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

        // stop loader on error in case the request is pending
        this.stopLoader();
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
}