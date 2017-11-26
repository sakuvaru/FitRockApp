import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataFormConfig } from '../data-form.config';
import { stringHelper, numberHelper } from '../../../lib/utilities';
import { BaseWebComponent } from '../../base-web-component.class';
import { DataFormField } from '../data-form-models';
import { Observable } from 'rxjs/Rx';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

export abstract class BaseFormControlComponent extends BaseWebComponent implements OnInit, OnChanges {

    @Input() field: DataFormField;
    @Input() formGroup: FormGroup;
    @Input() config: DataFormConfig;

    /**
     * Holds error message
     */
    private customError: string = '';

    /**
     * Indicates when the field is initialized
     */
    public initialized: boolean = false;

    /**
     * Can be used to perform custom validation on the field.
     * Has to be set before calling ngOnInit && ngOnChanges
     */
    protected customValidator: (value: any) => ValueValidationResult;

    /**
     * Return value used for insert forms
     */
    protected abstract getInsertValue(): string | boolean | number | Date | undefined;

    /**
     * Return value used for edit forms
     */
    protected abstract getEditValue(): string | boolean | number | Date | undefined;

    public get showLengthHint(): boolean {
        if (!this.field.options) {
            return false;
        }
        if (!this.field.options.maxLength) {
            return false;
        }
        if (this.field.options.maxLength > 0) {
            return true;
        }
        return false;

    }

    constructor(
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
    ) {
        super();
    }

    ngOnInit() {
        this.initField();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initField();
    }

    private initField(): void {
        if ((!this.config || !this.field || !this.formGroup)) {
            // inpur properties are not yet ready 
            return;
        }

        // subscribe only if field wasn't yet initialized
        if (!this.initialized) {
            // translate
            this.translate();

            // subscribe to changes
            this.subscribeToChanges();
        }

        // set field as initialized
        this.initialized = true;

        // init field value
        this.initFieldValue();


    }

    private initFieldValue(): void {
        // set insert/edit values
        if (this.config.isInsertForm) {
            const insertValue = this.getInsertValue();
            this.formGroup.controls[this.field.key].setValue(insertValue);
            this.field.value = insertValue;
        }

        if (this.config.isEditForm) {
            const editValue = this.getEditValue();
            this.formGroup.controls[this.field.key].setValue(editValue);
            this.field.value = editValue;
        }
    }

    private translate(): void {
        this.getReloadTranslationObservable()
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private subscribeToChanges(): void {
        this.getSubscribeToChangesObservable()
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private getReloadTranslationObservable(): Observable<any> {
        return this.getQuestionHintObservable()
            .map(hint => {
                // set hint only if the translation was successful 
                if (this.hintTranslationSuccessful(hint)) {
                    this.field.hint = hint;
                }
            })
            .zip(this.getQuestionLabelObservable()
                .map(label => {
                    this.field.label = label;
                }));
    }

    /**
     * Use this method to check value changes & to determine whether the value is valid or not
     */
    private getSubscribeToChangesObservable(): Observable<any> {
        const control = this.getQuestionControl();
        return control.valueChanges
            .map(newValue => {
                // run field change callback if defined
                if (this.config.onFieldValueChange) {
                    this.config.onFieldValueChange(this.config, this.field, newValue);
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
        translationData.label = this.field.label;

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
        if (this.field.label) {
            return Observable.of(this.field.label);
        }

        const labelTranslationKey = this.getQuestionLabelKey();

        let extraTranslationData;
        if (this.field.options) {
            extraTranslationData = this.field.options.extraTranslationData;
        }

        const originalTranslationObservable = this.translateService
            .get(labelTranslationKey, extraTranslationData);

        // no field label resolver is defined so we can return original translation
        if (!this.config.fieldLabelResolver) {
            return originalTranslationObservable;
        }

        // use custom translation
        return originalTranslationObservable.flatMap(fieldLabel => {
            if (!this.config.fieldLabelResolver) {
                return Observable.of(fieldLabel);
            }
            return this.config.fieldLabelResolver(this.field, fieldLabel);
        });
    }

    private getQuestionHintObservable(): Observable<string> {
        const translationKey = this.getQuestionHintKey();
        return this.translateService.get(translationKey);
    }

    private getQuestionLabelKey(): string {
        return 'form.' + stringHelper.firstCharToLowerCase(this.config.type) + '.' + stringHelper.firstCharToLowerCase(this.field.key);
    }

    private getQuestionHintKey(): string {
        return this.getQuestionLabelKey() + '.hint';
    }

    private getQuestionControl(): AbstractControl {
        return this.formGroup.controls[this.field.key];
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
