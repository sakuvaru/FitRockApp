import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormField, ControlTypeEnum, DropdownFieldOption } from '../../../lib/repository';
import { TranslateService } from '@ngx-translate/core';
import { FormConfig } from '../form-config.class';
import { stringHelper, numberHelper } from '../../../lib/utilities';
import { BaseWebComponent } from '../../base-web-component.class';
import { Observable } from 'rxjs/Rx';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

export abstract class BaseFormControlComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() question: FormField;
    @Input() form: FormGroup;
    @Input() formConfig: FormConfig<any>;

    /**
     * Holds error message
     */
    private customError: string = '';

    /**
     * Indicates when the field is initialized
     */
    protected initialized: boolean = false;

    /**
     * Can be used to perform custom validation on the field.
     * Has to be set before calling ngOnInit && ngOnChanges
     */
    protected customValidator: (value: any) => ValueValidationResult;

    /**
     * Return value used for insert forms
     */
    protected abstract getInsertValue(): string | boolean | number | Date;

    /**
     * Return value used for edit forms
     */
    protected abstract getEditValue(): string | boolean | number | Date;

    constructor(
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
    ) {
        super();
    }

    ngOnInit() {
        this.baseInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.baseInit();
    }

    private baseInit(): void {
        if (!this.formConfig || !this.question || !this.form) {
            return;
        }

        // translations
        this.getReloadTranslationObservable()
            .takeUntil(this.ngUnsubscribe)
            .subscribe();

        // value change observable
        this.getSubscribeToChangesObservable()
            .takeUntil(this.ngUnsubscribe)
            .subscribe();

        // set insert/edit values
        if (this.formConfig.isInsertForm()) {
            const insertValue = this.getInsertValue();
            this.form.controls[this.question.key].setValue(insertValue);
            this.question.value = insertValue;
        }

        if (this.formConfig.isEditForm()) {
            const editValue = this.getEditValue();
            this.form.controls[this.question.key].setValue(editValue);
            this.question.value = editValue;
        }

        // set question as initialized
        this.initialized = true;
    }

    private getReloadTranslationObservable(): Observable<any> {
        return this.getQuestionHintObservable()
            .map(hint => {
                // set hint only if the translation was successful 
                if (this.hintTranslationSuccessful(hint)) {
                    this.question.hint = hint;
                }
            })
            .zip(this.getQuestionLabelObservable()
                .map(label => {
                    this.question.label = label;
                }));
    }

    /**
     * Use this method to check value changes & to determin whether the value is valid or not
     */
    private getSubscribeToChangesObservable(): Observable<any> {
        const control = this.getQuestionControl();
        return control.valueChanges
            .takeUntil(this.ngUnsubscribe)
            .map(newValue => {
                // run field change callback if defined
                if (this.formConfig.onFieldValueChange) {
                    this.formConfig.onFieldValueChange(this.formConfig, this.question, newValue);
                }

                // check if the field's value is valid
                const valueValidation = this.getValidationResult(newValue);

                if (!valueValidation.isValid) {
                    this.translateService.get(valueValidation.errorMessageKey, valueValidation.translationData)
                        .subscribe(translatedErrorMessage => {
                            // set custom error so that it can be displayed in the html template
                            this.customError = translatedErrorMessage;
                            control.setErrors({
                                'customError': translatedErrorMessage
                            });
                        });
                } else {
                    // remove custom error
                    this.customError = '';
                }
            });
    }

    protected getValidationResult(value: any): ValueValidationResult {
        if (this.customValidator) {
            return this.customValidator(value);
        }

        const isValid = true;
        const errorMessageKey: string = '';
        const translationData: any = {};

        // set label
        translationData.label = this.question.label;

        return new ValueValidationResult(isValid, errorMessageKey, translationData);
    }

    private hintTranslationSuccessful(translatedText: string): boolean {
        if (!translatedText) {
            return false;
        }

        return !translatedText.startsWith('form.');
    }

    private getQuestionLabelObservable(): Observable<string> {
        // if the label is already set, use it (it could be set manually)
        if (this.question.label) {
            return Observable.of(this.question.label);
        }

        const labelTranslationKey = this.getQuestionLabelKey();

        let extraTranslationData;
        if (this.question.options) {
            extraTranslationData = this.question.options.extraTranslationData;
        }

        const originalTranslationObservable = this.translateService
            .get(labelTranslationKey, extraTranslationData);

        // no field label resolver is defined so we can return original translation
        if (!this.formConfig.fieldLabelResolver) {
            return originalTranslationObservable;
        }

        // use custom translation
        return originalTranslationObservable.flatMap(fieldLabel => {
            if (!this.formConfig.fieldLabelResolver) {
                return Observable.of(fieldLabel);
            }
            return this.formConfig.fieldLabelResolver(this.question, fieldLabel)
                .flatMap(mappedFieldLabel => {
                    return mappedFieldLabel;
                });
        });
    }

    private getQuestionHintObservable(): Observable<string> {
        const translationKey = this.getQuestionHintKey();
        return this.translateService.get(translationKey);
    }

    private getQuestionLabelKey(): string {
        return 'form.' + stringHelper.firstCharToLowerCase(this.formConfig.type) + '.' + stringHelper.firstCharToLowerCase(this.question.key);
    }

    private getQuestionHintKey(): string {
        return this.getQuestionLabelKey() + '.hint';
    }

   

    private getQuestionControl(): AbstractControl {
        return this.form.controls[this.question.key];
    }

    private getQuestionValue(): any {
        return this.getQuestionControl().value;
    }
}

export class ValueValidationResult {
    constructor(
        public isValid: boolean,
        public errorMessageKey: string,
        public translationData: any
    ) { }
}
