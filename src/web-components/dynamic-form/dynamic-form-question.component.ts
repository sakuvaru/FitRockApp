import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormField, ControlTypeEnum } from '../../lib/repository';
import { TranslateService } from '@ngx-translate/core';
import { FormConfig } from './form-config.class';
import { stringHelper, numberHelper } from '../../lib/utilities';
import { BaseWebComponent } from '../base-web-component.class';
import { Observable } from 'rxjs/Rx';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent extends BaseWebComponent implements OnInit, OnChanges {

  @Input() question: FormField;

  @Input() form: FormGroup;

  @Input() formConfig: FormConfig<any>;

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  public questionLabel: string;
  private questionHint: string;
  private showRequiredLabels: boolean = true;

  private checkBoxIsChecked: boolean = false;
  private radioCheckboxTrueChecked: boolean;
  private radioCheckboxFalseChecked: boolean;

  private customError: string = '';

  /**
   * Maximum value for numbers (assuming the number is represented by Int32)
   * https://msdn.microsoft.com/en-us/library/system.int32.maxvalue(v=vs.110).aspx
   */
  private readonly maximumNumberValue = 2147483647;

  /**
   * Minimum value for numbers (assuming the number is represented by Int32)
   * https://msdn.microsoft.com/en-us/library/system.int32.minvalue(v=vs.110).aspx
   */
  private readonly miniumNumberValue = -2147483648;


  ngOnInit() {
    // init question
    if (this.formConfig) {
      this.initValues(this.formConfig);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.question && this.formConfig && changes.form && changes.form.currentValue) {
      this.initValues(this.formConfig);
    }
  }

  getReloadTranslationObservable(): Observable<any> {
    return this.getQuestionHintTranslationObservable()
      .zip(this.getQuestionLabelTranslationObservable());
  }

  private initValues(config: FormConfig<any>): void {
    if (!config) {
      console.warn(`Cannot initialize question '${this.question.key}')`);
      return;
    }

    // translations
    const translationsObservable = this.getReloadTranslationObservable()
      .takeUntil(this.ngUnsubscribe)
      .subscribe();

    // value change observable
    const changeObservable = this.getSubscribeToChangesObservable()
      .takeUntil(this.ngUnsubscribe)
      .subscribe();


    // this should be first -> set the 'value' of form control to 'defaultValue' in case of insert form
    // this can be overriden by more specific control types needs (e.g the radio button)
    if (this.formConfig.isInsertForm()) {
      // set value only if standard 'value' is not set (value could be set for e.g. hidden field)
      if (!this.question.value) {
        this.form.controls[this.question.key].setValue(this.question.defaultValue);
      }
    }

    // translate labels for radio boolean
    if (this.question.controlTypeEnum === ControlTypeEnum.RadioBoolean) {
      if (this.question.options && this.question.options.trueOptionLabel) {
        this.translateService.get(this.question.options.trueOptionLabel).subscribe(translatedText => {
          if (translatedText && this.question.options) {
            this.question.options.trueOptionLabel = translatedText;
          }
        });
      }
      if (this.question.options && this.question.options.falseOptionLabel) {
        this.translateService.get(this.question.options.falseOptionLabel).subscribe(translatedText => {
          if (translatedText && this.question.options) {
            this.question.options.falseOptionLabel = translatedText;
          }
        });
      }
    }

    // translate list options
    if (this.question.controlTypeEnum === ControlTypeEnum.Dropdown) {
      if (this.question.options && this.question.options.listOptions) {
        this.question.options.listOptions.forEach(option => {
          this.translateService.get(option.name).subscribe(translatedText => {
            if (translatedText && this.question.options && this.question.options.listOptions) {
              const optionInList = this.question.options.listOptions.find(m => m.value === option.value);
              if (!optionInList) {
                throw Error(`Option '${option.value}' was not found in list`);
              }
              optionInList.name = translatedText;
            }
          });
        });
      }
    }

    // set default checkbox value to false programatically (it will otherwise treat checkbox as undefined)
    if (this.question.controlTypeEnum === ControlTypeEnum.Boolean && !this.question.required) {
      if (this.formConfig.isEditForm()) {
        this.form.controls[this.question.key].setValue(this.question.value);
        this.checkBoxIsChecked = this.question.value;
      } else {
        // set default value of checkbox for insert forms
        let defaultValue: boolean;
        if (this.question.defaultValue) {
          defaultValue = true;
        } else {
          defaultValue = false;
        }
        this.form.controls[this.question.key].setValue(defaultValue);
        this.checkBoxIsChecked = defaultValue;
      }
    }
    // set default value for radio boolean
    if (this.question.controlTypeEnum === ControlTypeEnum.RadioBoolean) {
      if (this.formConfig.isEditForm()) {
        // set checkbox status based on question value
        this.form.controls[this.question.key].setValue(this.question.value);
        this.radioCheckboxTrueChecked = this.question.value;
        this.radioCheckboxFalseChecked = !this.question.value;
      } else {
        // set default value for insert forms
        let defaultValue: boolean;
        if (this.question.defaultValue) {
          defaultValue = true;
        } else {
          defaultValue = false;
        }
        this.form.controls[this.question.key].setValue(defaultValue);
        this.radioCheckboxTrueChecked = defaultValue;
        this.radioCheckboxFalseChecked = !defaultValue;
      }
    }

    if (this.isDateField()) {
      if (this.formConfig.isEditForm()) {
        // set date field starting date (if its set)

        const date = this.getQuestionValue();

        if (this.question.rawValue) {
          // date is set, set it
          this.form.controls[this.question.key].setValue(new Date(date));
        }
      } else if (this.formConfig.isInsertForm()) {
        this.form.controls[this.question.key].setValue(new Date());
      }
    }

    // fix angular changes error
    this.cdr.detectChanges();
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
        const valueValidation = this.getCustomValidationResult(newValue);

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

  private getCustomValidationResult(value: any): ValueValidationResult {
    let isValid = true;
    let errorMessageKey: string = 'form.error.unknown';
    const translationData: any = {};

    // set label
    translationData.label = this.question.translatedLabel;

    // check custom validation
    if (this.isNumberField()) {
      if (!numberHelper.isNumber(this.getQuestionValue())) {
        // if min value = 0 && number is 0, its all good
        if (this.getMinNumberValue() === 0 && value === 0) {
          isValid = true;
        } else {
          isValid = false;
          errorMessageKey = 'form.error.valueIsNotANumber';
        }
      } else {
        // field is number, but check its min & max values
        const maxValue = this.getMaxNumberValue();
        const minValue = this.getMinNumberValue();

        if (value > maxValue && value > 0) {
          isValid = false;
          errorMessageKey = 'form.error.invalidMaxNumberValue';
          translationData.number = maxValue;
        }
        if (value < minValue && value < 0) {
          isValid = false;
          errorMessageKey = 'form.error.invalidMinNumberValue';
          translationData.number = minValue;
        }
      }
    }

    return new ValueValidationResult(isValid, errorMessageKey, translationData);
  }

  private getQuestionLabelTranslationObservable(): Observable<any> {
    const labelTranslationKey = this.getQuestionLabelKey();

    let extraTranslationData;
    if (this.question.options) {
      extraTranslationData = this.question.options.extraTranslationData;
    }

    const originalTranslationObservable = this.translateService
      .get(labelTranslationKey, extraTranslationData)
      .map(translatedLabel => this.question.translatedLabel = translatedLabel);

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
        .map(mappedFieldLabel => {
          this.question.translatedLabel = mappedFieldLabel;
        });
    });
  }

  private getQuestionHintTranslationObservable(): Observable<any> {
    const translationKey = this.getQuestionHintKey();
    return this.translateService.get(translationKey).map(translatedText => {
      if (this.translationSuccessful(translatedText)) {
        this.questionHint = translatedText;
      }
    });
  }

  private translationSuccessful(translatedText: string): boolean {
    if (!translatedText) {
      return false;
    }

    return !translatedText.startsWith('form.');
  }

  private getQuestionLabelKey(): string {
    return 'form.' + stringHelper.firstCharToLowerCase(this.formConfig.type) + '.' + stringHelper.firstCharToLowerCase(this.question.key);
  }

  private getQuestionHintKey(): string {
    return this.getQuestionLabelKey() + '.hint';
  }

  private showLengthHint(): boolean {
    if (!this.question.options) {
      return false;
    }
    if (!this.question.options.maxLength) {
      return false;
    }
    if (this.question.options.maxLength > 0) {
      return true;
    }
    return false;
  }

  private getMaxNumberValue(): number {
    if (!this.question.options) {
      return this.maximumNumberValue;
    }

    const definedNumber = this.question.options.maxNumberValue;
    if (definedNumber === 0) {
      return 0;
    }
    if (definedNumber) {
      if (definedNumber > this.maximumNumberValue) {
        return this.maximumNumberValue;
      }
      return definedNumber;
    }
    return this.maximumNumberValue;
  }

  private getMinNumberValue(): number {
    if (!this.question.options) {
      return this.miniumNumberValue;
    }

    const definedNumber = this.question.options.minNumberValue;
    if (definedNumber === 0) {
      return 0;
    }
    if (definedNumber) {
      if (definedNumber > this.miniumNumberValue) {
        return this.miniumNumberValue;
      }
      return definedNumber;
    }
    return this.miniumNumberValue;
  }

  private handleRadioButtonChange(): void {
    this.showRequiredLabels = false;
  }

  private getQuestionControl(): AbstractControl {
    return this.form.controls[this.question.key];
  }

  private getQuestionValue(): any {
    return this.getQuestionControl().value;
  }

  // field types
  private isDropdownField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Dropdown;
  }

  private isDateField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Date;
  }

  private isBooleanField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Boolean;
  }

  private isRadioBooleanField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.RadioBoolean;
  }

  private isTextField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Text;
  }

  private isTextAreaField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.TextArea;
  }

  private isHiddenField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Hidden;
  }

  private isNumberField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Number;
  }

}

class ValueValidationResult {
  constructor(
    public isValid: boolean,
    public errorMessageKey: string,
    public translationData: any
  ) { }
}
