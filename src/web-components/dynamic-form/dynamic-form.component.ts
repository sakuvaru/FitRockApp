// Core
import { EventEmitter, Component, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject } from 'rxjs/Rx';

// models
import { FormConfig } from './form-config.class';
import { DynamicFormStatus } from './dynamic-form-status.class';

import { BaseWebComponent } from '../base-web-component.class';
import {
    FormValidationResultEnum, ResponseCreate, ResponseEdit, FormErrorResponse,
    ErrorResponse, ErrorReasonEnum, FormField, ResponseDelete, FormValidationResult
} from '../../lib/repository';

// services
import { TranslateService } from '@ngx-translate/core';
import { FieldControlService } from './field-control.service';

// helpers
import { observableHelper, stringHelper } from '../../lib/utilities';

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

    private localLoaderEnabled = false;

    private insufficientLicenseError: string;
    private generalErrorMessage: string;
    private unknownErrorMessage: string;
    private formLoadingErrorMessage: string;

    private questions: FormField[] = [];

    private deleteText: string;
    private submitText: string;
    private snackbarText: string;
    private deleteSnackbarText: string;
    private savedText: string;

    private response: any;

    private form: FormGroup;

    private formError: string;

    private formErrorLines: string[] = [];

    private isDeleteEnabled = false;
    private isEditForm = false;
    private isInsertForm = false;

    /**
     * Output that indicates if form is valid, typically used when custom button are used
     */
    @Output() statusChanged = new EventEmitter<DynamicFormStatus>();

    /**
     * Form configuration
     */
    @Input() config: FormConfig<any>;

    /**
     * Subject used to trigger save functionality when buttons need to be used outside of form
     */
    @Input() customDeleteButtonSubject: Subject<void>;
    @Input() customSaveButtonSubject: Subject<void>;

    /**
     * Flag for initialization component, used because ngOngChanges can be called before ngOnInit
     * which would cause component to be initialized twice (happened when component is inside a dialog)
     * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
     */
    public initialized = false;

    constructor(
        private fieldControlService: FieldControlService,
        private snackBarService: MatSnackBar,
        private translateService: TranslateService,
        private cdr: ChangeDetectorRef
    ) {
        super();
    }

    ngOnInit() {
        if (this.config) {
            this.initDynamicForm(this.config);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // re-initalize form when questions changes because dynamic form may recieve config with questions
        // after the initilization of component
        if (changes.config.currentValue) {
            this.initDynamicForm(changes.config.currentValue);
        }
    }

    /**
     * Reloads form using new config
     * @param config Form config
     */
    forceReinitialization(config: FormConfig<any>): void {
        this.initialized = false;
        this.initDynamicForm(config);
    }

    /**
     * Reloads form using current config
     */
    reloadData(): void {
        this.initialized = false;
        this.initDynamicForm(this.config);
    }

    private initDynamicForm(config: FormConfig<any>): void {
        // try to initialize component if config is available during init
        if (config && !this.initialized) {
            // enable local loader
            if (config.enableLocalLoader) {
                this.localLoaderEnabled = true;
            }

            if (config.onBeforeFormInit) {
                config.onBeforeFormInit();
            }

            // start loader
            if (config.loaderConfig) {
                config.loaderConfig.start();
            }

            // subscribe to button events
            this.initButtonSubscriptions(config);

            // form type
            this.isDeleteEnabled = this.deleteIsEnabled(config);
            this.isEditForm = config.isEditForm();
            this.isInsertForm = config.isInsertForm();

            // translate labels
            this.getTranslateLabelsObservable(config)
                .takeUntil(this.ngUnsubscribe)
                .subscribe();

            // init fields
            this.getInitFormObservable(config)
                .subscribe(() => {
                    let formStatus: DynamicFormStatus;

                    // subscribe to form status changes so that it can be emitted
                    this.form.statusChanges
                        .map(status => {
                            let isValid = false;
                            if (status === 'VALID') {
                                isValid = true;
                            }

                            formStatus = new DynamicFormStatus(
                                isValid,
                                this.isDeleteEnabled,
                                this.isEditForm,
                                this.isInsertForm
                            );

                            this.statusChanged.next(formStatus);
                        })
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe();

                    // check if form is valid at this moment (e.g. when values from edit form are set)
                    formStatus = new DynamicFormStatus(
                        this.form.valid,
                        this.isDeleteEnabled,
                        this.isEditForm,
                        this.isInsertForm
                    );

                    this.statusChanged.next(formStatus);

                    // stop loader
                    if (config.loaderConfig) {
                        config.loaderConfig.stop();
                    }

                    // stop local loader
                    if (config.enableLocalLoader) {
                        this.localLoaderEnabled = false;
                    }
                },
                err => {
                    this.handleLoadError(config, err);
                });
        }

        // set component as initialized
        this.initialized = true;
    }

    private getInitFormObservable(config: FormConfig<any>): Observable<any> {

        if (config.isInsertForm()) {
            if (!config.insertFormDefinition) {
                throw Error(`Cannot init 'insert' form because no form definition was provided`);
            }

            return config.insertFormDefinition
                .map(form => {
                    // get fields
                    const fields = form.fields;

                    if (config.fieldValueResolver && fields && fields.length > 0) {
                        // resolve custom field values
                        if (config.fieldValueResolver) {
                            // got through all fields and try resolving their value through custom resolver
                            fields.forEach(field => {
                                if (!config.fieldValueResolver) {
                                    console.warn(`Cannot resolve form field value for field '${field.key}'`);
                                    return;
                                }
                                const newValue = config.fieldValueResolver(field.key, field.value);

                                // set value
                                field.value = this.getFieldValueSetByResolver(newValue);
                            });
                        }
                    }

                    // load fields
                    this.form = this.fieldControlService.toFormGroup(fields);

                    // assign questions from fields
                    this.assignQuestions(fields);

                    // assign fields to form config (these fields are used by question component)
                    this.config.fields = fields;

                    // subscribe to form changes
                    this.form.valueChanges
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(response => this.handleFormChange());

                    // form loaded
                    if (config.onInsertFormLoaded) {
                        config.onInsertFormLoaded(form);
                    }
                });
        } else if (config.isEditForm()) {
            if (!config.editFormDefinition) {
                throw Error(`Cannot init 'edit' form because no form definition was provided`);
            }
            return config.editFormDefinition
                .map(form => {
                    const fields = form.fields;

                    // load fields
                    this.form = this.fieldControlService.toFormGroup(fields);

                    // assign questions from fields
                    this.assignQuestions(fields);

                    // assign fields to form config (these fields are used by question component)
                    this.config.fields = fields;

                    // resolve custom field values
                    if (config.fieldValueResolver && fields && fields.length > 0) {
                        if (config.fieldValueResolver) {
                            // go through all fields and try resolving their value through custom resolver
                            fields.forEach(field => {
                                if (!config.fieldValueResolver) {
                                    console.warn(`Cannot resolve form field value for field '${field.key}'`);
                                    return;
                                }
                                const newValue = config.fieldValueResolver(field.key, field.value);

                                // set field value
                                field.value = this.getFieldValueSetByResolver(newValue);
                            });
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
                });
        }
        throw Error(`Unsupported form type`);
    }

    private initButtonSubscriptions(config: FormConfig<any>): void {
        // !! Important - unsubscribe from buttons. If dynamic form is reloaded within the same page, it may happen
        // that clicking save will fire multiple times
        this.initButtons();

        // init custom button clicks (useful when default form buttons are hidden (e.g. in dialogs)) and custom
        // click need to be handled
        if (this.customSaveButtonSubject) {
            if (config.isInsertForm()) {
                this.getInsertButtonObservable(this.customSaveButtonSubject, config)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(() => { }, err => this.handleSaveError(config, err));
            } else if (config.isEditForm()) {
                this.getEditButtonObservable(this.customSaveButtonSubject, config)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(() => { }, err => this.handleSaveError(config, err));
            }
        }
        if (this.customDeleteButtonSubject) {
            if (this.deleteIsEnabled(config)) {
                this.getDeleteButtonObservable(this.customDeleteButtonSubject, config)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(() => { }, err => this.handleSaveError(config, err));
            }
        }

        // use default subscription & buttons if either of the custom buttons are used
        if (!this.customDeleteButtonSubject && !this.customSaveButtonSubject) {
            if (config.isInsertForm()) {
                this.getInsertButtonObservable(this.insertButtonSubject, config)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(() => { }, err => this.handleSaveError(config, err));
            } else if (config.isEditForm()) {
                this.getEditButtonObservable(this.editButtonSubject, config)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe(() => { }, err => this.handleSaveError(config, err));

                if (this.deleteIsEnabled(config)) {
                    this.getDeleteButtonObservable(this.deleteButtonSubject, config)
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(() => { }, err => this.handleSaveError(config, err));
                }
            }
        }

    }

    private getInsertButtonObservable(buttonSubject: Subject<void>, config: FormConfig<any>): Observable<any> {
        return buttonSubject
            .switchMap(event => {
                if (!config.insertFunction) {
                    throw new Error('Insert function is not defined');
                }

                // before save
                if (config.onBeforeSave) {
                    config.onBeforeSave();
                }

                // start loader
                this.startLoader(config);

                // do not allow nulls to be send
                this.convertEmptyStringsToNull();

                return config.insertFunction(this.form.value);
            })
            .map(response => {
                this.response = response;
                this.handleInsertAfter(config, response);

                // form clear
                this.handleFormClear(config);

                // after save
                if (config.OnAfterSave) {
                    config.OnAfterSave();
                }

                // clear any remaining error messages
                this.clearErrorMessages();

                // stop loader
                this.stopLoader(config);
            });
    }

    private getEditButtonObservable(buttonSubject: Subject<void>, config: FormConfig<any>): Observable<any> {
        return buttonSubject
            .switchMap(event => {
                if (!config.editFunction) {
                    throw new Error('Edit function is not defined');
                }

                // before save
                if (config.onBeforeSave) {
                    config.onBeforeSave();
                }

                // start loader
                this.startLoader(config);

                // do not allow nulls to be send
                this.convertEmptyStringsToNull();

                return config.editFunction(this.form.value);
            })
            .map(response => {
                this.response = response;
                this.handleUpdateAfter(config, response);

                // after save
                if (config.OnAfterSave) {
                    config.OnAfterSave();
                }

                // clear any remaining error messages
                this.clearErrorMessages();

                // stop loader
                this.stopLoader(config);
            });
    }

    private getDeleteButtonObservable(buttonSubject: Subject<void>, config: FormConfig<any>): Observable<any> {
        return buttonSubject
            .switchMap(response => {
                if (!config.deleteFunction) {
                    throw new Error('Delete function is not defined');
                }

                // before delete
                if (config.onBeforeDelete) {
                    config.onBeforeDelete(this.form.value);
                }

                // start loader
                this.startLoader(config);

                this.convertEmptyStringsToNull();

                return config.deleteFunction(this.form.value);
            })
            .map(response => {
                this.response = response;
                this.handleDeleteAfter(config, response);

                // clear any remaining error messages
                this.clearErrorMessages();

                // stop loader
                this.stopLoader(config);
            });
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

        const tempQuestions: FormField[] = [];

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

        const fieldInHiddenFields = this.config.hiddenFields.find(m => m === key);

        if (fieldInHiddenFields) {
            return false;
        }
        return true;
    }

    private getTranslateLabelsObservable(config: FormConfig<any>): Observable<any> {
        const observables: Observable<any>[] = [];

        observables.push(this.translateService.get(config.submitTextKey).map(translation => this.submitText = translation));
        observables.push(this.translateService.get(config.snackBarTextKey).map(translation => this.snackbarText = translation));
        observables.push(this.translateService.get(config.deleteSnackBarTextKey).map(translation => this.deleteSnackbarText = translation));
        observables.push(this.translateService.get(config.deleteTextKey).map(translation => this.deleteText = translation));

        observables.push(this.translateService.get('form.error.insufficientLicense').map(translation => this.insufficientLicenseError = translation));
        observables.push(this.translateService.get('form.error.saveFailed').map(translation => this.generalErrorMessage = translation));
        observables.push(this.translateService.get('form.error.unknownFormErrorMessage').map(translation => this.unknownErrorMessage = translation));
        observables.push(this.translateService.get('form.error.formLoadingError').map(translation => this.formLoadingErrorMessage = translation));

        return observableHelper.zipObservables(observables);
    }

    private startLoader(config: FormConfig<any>): void {
        if (config.loaderConfig) {
            config.loaderConfig.start();
        }

        if (config.enableLocalLoader) {
            this.localLoaderEnabled = true;
        }
    }

    private stopLoader(config: FormConfig<any>): void {
        if (config.loaderConfig) {
            config.loaderConfig.stop();
        }

        if (config.enableLocalLoader) {
            this.localLoaderEnabled = false;
        }
    }

    private handleFormChange(): void {
        // remove error message when any input in form changes
        this.formError = '';
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
            this.clearForm();
        }

        // stop loader on error in case the request is pending
        this.stopLoader(config);
    }

    private clearForm(): void {
        this.form = this.fieldControlService.toFormGroup(this.questions);
    }

    private convertEmptyStringsToNull(): void {
        this.questions.forEach(question => {
            const formInput = this.form.controls[question.key];

            if (formInput.value === '') {
                formInput.setValue(null);
            }
        });
    }

    public handleLoadError(config: FormConfig<any>, error: ErrorResponse | FormErrorResponse | any): void {
        // log error because there is no guarantee that master component will handle it (in which case no error would be shown at all)
        console.error(error);

        if (this.config.onError) {
            this.config.onError(error);
        }

        if (error instanceof ErrorResponse) {
            if (error.reason === ErrorReasonEnum.LicenseLimitation) {
                this.formError = this.insufficientLicenseError;
            } else {
                this.formError = this.formLoadingErrorMessage;
            }
        } else {
            console.log('asef');
            console.log(this.formLoadingErrorMessage);
            this.formError = this.formLoadingErrorMessage;
        }

        this.stopLoader(config);
    }

    private handleSaveError(config: FormConfig<any>, error: ErrorResponse | FormErrorResponse | any): void {
        // log error because there is no guarantee that master component will handle it (in which case no error would not be shown at all)
        console.error(error);

        // clear existing errors
        this.clearErrorMessages();

        // buttons clicks need to be reinitialized because otherwise it was not possible to resubmit the form
        // after it failed because of some error
        this.initButtonSubscriptions(config);

        // stop loader on error in case the request is pending
        this.stopLoader(config);

        if (this.config.onError) {
            this.config.onError(error);
        }

        if (error instanceof FormErrorResponse) {
            // handle unknown errors
            if (error.formValidation.validationResult === FormValidationResultEnum.Other) {
                this.formError = this.unknownErrorMessage;
                return;
            }

            this.getFormFieldErrorMessage(error.formValidation)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(fieldErrorMessage => {
                    // handle situations where field name is known
                    const column = error.formValidation.column;
                    if (column) {
                        const fieldWithError = this.form.controls[column];

                        // field is found within form = add error message to that particular field
                        if (fieldWithError) {
                            fieldWithError.setErrors({ 'field_error': error });

                            // get translated label of the form field
                            const formField = this.questions.find(m => m.key.toLowerCase() === column.toLocaleLowerCase());

                            if (formField) {
                                // form error
                                this.getFormErrorMessage(error.formValidation, formField.label || formField.key)
                                    .takeUntil(this.ngUnsubscribe)
                                    .subscribe(formError => this.formErrorLines.push(formError));
                            } else {
                                console.warn(`Form field '${column}' could not be found in form and therefore error message could not be displayed`);
                            }
                        }

                        // field is NOT found within form = add error message to form as a whole
                        if (!fieldWithError) {
                            this.formErrorLines.push(fieldErrorMessage);
                        }
                    } else {
                        // field is not known = add error message to form as a whole
                        this.formErrorLines.push(fieldErrorMessage);
                    }
                });

            // set submission error
            this.formError = this.formErrorLines.join(', ');

        } else if (error instanceof ErrorResponse) {
            // handle license errors differently
            if (error.reason === ErrorReasonEnum.LicenseLimitation) {
                this.formError = this.insufficientLicenseError;
            } else {
                this.formError = this.generalErrorMessage;
            }
        } else {
            this.formError = this.unknownErrorMessage;
        }
    }

    private getFormErrorMessage(validation: FormValidationResult, fieldLabel: string): Observable<string> {
        return this.getFormFieldErrorMessage(validation, fieldLabel);
    }

    private getFormFieldErrorMessage(validation: FormValidationResult, fieldLabel?: string): Observable<string> {
        if (validation.validationResult === FormValidationResultEnum.InvalidCodename) {
            if (fieldLabel) {
                return this.translateService.get('form.error.invalidCodenameWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.invalidCodename');
        }

        if (validation.validationResult === FormValidationResultEnum.InvalidEmail) {
            if (fieldLabel) {
                return this.translateService.get('form.error.invalidEmailWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.invalidEmail');
        }

        if (validation.validationResult === FormValidationResultEnum.NotUnique) {
            if (fieldLabel) {
                return this.translateService.get('form.error.notUniqueWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.notUnique');
        }

        if (validation.validationResult === FormValidationResultEnum.NotEditable) {
            if (fieldLabel) {
                return this.translateService.get('form.error.notEditableWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.notEditable');
        }

        if (validation.validationResult === FormValidationResultEnum.Other) {
            if (fieldLabel) {
                return this.translateService.get('form.error.otherWithLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.other');
        }

        if (validation.validationResult === FormValidationResultEnum.OneRecordPerDay) {
            if (fieldLabel) {
                return this.translateService.get('form.error.oneRecordPerDayLabel', { label: fieldLabel });
            }
            return this.translateService.get('form.error.oneRecordPerDay');
        }

        if (validation.validationResult === FormValidationResultEnum.CustomWithMessageKey) {
            const translationKey = `form.${this.config.type.toLowerCase()}.${validation.messageKey}`;
            if (fieldLabel) {
                return this.translateService.get(translationKey, { label: fieldLabel });
            }
            return this.translateService.get(translationKey);
        }

        if (validation.validationResult === FormValidationResultEnum.ConstraintConflict) {
            const messageKey = validation.messageKey;
            if (messageKey) {
                // we know what type is causing this issue
                const affectedTypeTranslationKey = `type.${stringHelper.toCamelCase(messageKey)}`;
                const constraintConflictTranslationKey = `form.error.constraintConflict`;
                
                return this.translateService.get(affectedTypeTranslationKey).switchMap(translatedType => {
                    const data: any = {'dependentType': translatedType};
                    return this.translateService.get(constraintConflictTranslationKey, data);
                });
            } else {
                // we don't know what type is causing the issue
                const genericConstraintErrorKey = 'form.error.genericConstraintConflict';
                return this.translateService.get(genericConstraintErrorKey);
            }
        }

        return this.translateService.get('form.error.unknown');
    }

    private clearErrorMessages(): void {
        this.formErrorLines = [];
        this.formError = '';
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
