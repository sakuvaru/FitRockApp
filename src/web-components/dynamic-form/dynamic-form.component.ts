import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldControlService } from './field-control.service';
import { FormConfig } from './form-config.class';
import { MdSnackBar } from '@angular/material';
import {
    ColumnValidation, FieldErrorEnum, ResponseCreate, ResponseEdit, FormErrorResponse,
    ErrorResponse, ErrorReasonEnum, BaseField
} from '../../lib/repository';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    providers: [FieldControlService]
})
export class DynamicFormComponent implements OnInit, OnChanges {

    private insufficientLicenseError: string;
    private generalErrorMessagePrefix: string;
    private unknownErrorMessage: string;

    private questions: BaseField<any>[] = [];

    private submitText: string;
    private snackbarText: string;
    private savedText: string;

    public response: any;

    private form: FormGroup;

    private submissionError: string;

    private formErrorLines: string[] = [];

    // inputs
    @Input() config: FormConfig<any>;

    constructor(
        private fieldControlService: FieldControlService,
        private snackBarService: MdSnackBar,
        private translateService: TranslateService,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit() {
        // try to initialize component if config is available during init
        if (this.config) {
            if (this.config.onFormInit) {
                this.config.onFormInit();
            }

            // load fields
            this.form = this.fieldControlService.toFormGroup(this.config.fields);

            // assign questions from fields
            this.assignQuestions(this.config.fields)

            // subscribe to form changes
            this.form.valueChanges.subscribe(response => this.handleFormChange());

            // translate labels
            this.translateLabels();
        }

        this.cdr.detectChanges();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        // re-initalize form when questions changes because dynamic form may recieve config with questions 
        // after the initilization of component 
        if (changes.config && changes.config.currentValue) {
            // load fields
            this.form = this.fieldControlService.toFormGroup(changes.config.currentValue.fields);

            // assign questions from fields
            this.assignQuestions(changes.config.currentValue.fields)

            // subscribe to form changes
            this.form.valueChanges.subscribe(response => this.handleFormChange());
            changes.config.currentValue.submitText = changes.config.currentValue.submitText;
            // translate labels
            this.translateLabels();

            if (this.config.onFormLoaded) {
                this.config.onFormLoaded();
            }
        }
    }

    onSubmit() {
        // before save
        if (this.config.onBeforeSave) {
            this.config.onBeforeSave();
        }

        // save form
        if (this.config.isInsertForm()) {
            this.convertEmptyStringsToNull();
            this.config.insertFunction(this.form.value)
                .finally(() => {
                    // after save
                    if (this.config.OnAfterSave) {
                        this.config.OnAfterSave();
                    }
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleInsertAfter(response);
                },
                (err) => {
                    this.handleError(err);
                });
        }
        else if (this.config.isEditForm()) {
            this.convertEmptyStringsToNull();
            this.config.editFunction(this.form.value)
                .finally(() => {
                    // after save
                    if (this.config.OnAfterSave) {
                        this.config.OnAfterSave();
                    }
                })
                .subscribe(response => {
                    this.response = response;
                    this.handleUpdateAfter(response);
                },
                (err) => {
                    this.handleError(err);
                });
        }
        else {
            throw Error("No save function was provided to form");
        }
    }

    private assignQuestions(fields: BaseField<any>[]): void {
        if (!fields) {
            return;
        }

        var tempQuestions: BaseField<any>[] = [];

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
        // if show fields are not defined, all fields are permitted
        if (!this.config.showFields) {
            return true;
        }

        if (this.config.showFields.find(showField => {
            if (!showField) {
                throw Error(`Field defined in 'showFields' cannot be empty`);
            }
            if (!key) {
                throw Error(`Field key cannot be empty`);
            }
            return showField.toLowerCase() === key.toLowerCase()
        })) {
            return true;
        }
        return false;
    }

    private translateLabels(): void {
        this.translateService.get(this.config.submitTextKey).subscribe(key => this.submitText = key);
        this.translateService.get(this.config.snackBarTextKey).subscribe(key => this.snackbarText = key);

        this.translateService.get('form.error.insufficientLicense').subscribe(key => this.insufficientLicenseError = key);
        this.translateService.get('form.error.saveFailedPrefix').subscribe(key => this.generalErrorMessagePrefix = key);
        this.translateService.get('form.error.unknownFormErrorMessage').subscribe(key => this.unknownErrorMessage = key);
    }

    private handleFormChange(): void {
        // remove error message when any input in form changes
        this.submissionError = null;
        this.formErrorLines = [];

        // detect changes manually when changing values used in template!
        this.cdr.detectChanges();
    }

    private handleSnackBar(): void {
        if (this.config.showSnackBar) {
            this.snackBarService.open(this.snackbarText, null, { duration: 2500 });
        }
    }

    private handleUpdateAfter(response: ResponseEdit<any> | any): void {
        this.handleSnackBar();

        if (this.config.onUpdate) {
            this.config.onUpdate(response);
        }
    }

    private handleInsertAfter(response: ResponseCreate<any> | any): void {
        this.handleSnackBar();

        if (this.config.onInsert) {
            this.config.onInsert(response);
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
                    this.form.controls[validationResult.columnName].setErrors({ 'field_error': error });
                });

                // get translated label of the form field
                var formField = this.questions.find(m => m.key.toLowerCase() === validationResult.columnName.toLocaleLowerCase());

                // form error
                this.getFormErrorMessage(validationResult, formField.translatedLabel).subscribe(error => this.formErrorLines.push(error))
            });
            this.submissionError = this.formErrorLines.join(', ');
        }
        else if (errorResponse instanceof ErrorResponse) {
            console.error(errorResponse);
            // handle license errors differently
            if (errorResponse.reason === ErrorReasonEnum.LicenseLimitation) {
                this.submissionError = this.insufficientLicenseError;
            }
            else {
                this.submissionError = this.generalErrorMessagePrefix + errorResponse.error;
            }
        }
        else {
            console.error(errorResponse);
            this.submissionError = this.unknownErrorMessage;
        }
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
                return this.translateService.get('form.error.notEditableWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.notEditable');
        }

        if (columnValidation.errorType === FieldErrorEnum.NotEditable) {
            if (fieldLabel) {
                return this.translateService.get('form.error.notUniqueWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.notUnique');
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