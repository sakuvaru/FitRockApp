import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField, ControlTypeEnum } from '../../lib/repository';
import { TranslateService } from '@ngx-translate/core';
import { FormConfig } from './form-config.class';
import { StringHelper } from '../../lib/utilities';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent implements OnInit {

  @Input() question: BaseField<any>;

  @Input() form: FormGroup;

  @Input() formConfig: FormConfig<any>;

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
  }

  public questionLabel: string;

  private questionHint: string;

  private showRequiredLabels: boolean = true;

  private datePickerStartDate = new Date(1980, 0, 1);

  private checkBoxIsChecked: boolean = false;

  private radioCheckboxTrueChecked: boolean;
  private radioCheckboxFalseChecked: boolean;

  ngOnInit() {
    // translation
    this.translateQuestionHint();
    this.translateQuestionLabel();

    // init values
    this.initValues();
  }

  private initValues(): void {
    // translate labels for radio boolean
    if (this.question.controlTypeEnum === ControlTypeEnum.RadioBoolean) {
      if (this.question.options && this.question.options.trueOptionLabel) {
        this.translateService.get(this.question.options.trueOptionLabel).subscribe(translatedText => {
          if (translatedText) {
            this.question.options.trueOptionLabel = translatedText
          }
        });
      }
      if (this.question.options && this.question.options.falseOptionLabel) {
        this.translateService.get(this.question.options.falseOptionLabel).subscribe(translatedText => {
          if (translatedText) {
            this.question.options.falseOptionLabel = translatedText
          }
        });
      }
    }

    // translate list options
    if (this.question.controlTypeEnum === ControlTypeEnum.Dropdown) {
      if (this.question.options && this.question.options.listOptions) {
        this.question.options.listOptions.forEach(option => {
          this.translateService.get(option.name).subscribe(translatedText => {
            if (translatedText) {
              var optionInList = this.question.options.listOptions.find(m => m.value === option.value);
              optionInList.name = translatedText;
            }
          });
        });
      }
    }

    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // set default checkbox value to false programatically (it will otherwise treat checkbox as undefined)
    if (this.question.controlTypeEnum === ControlTypeEnum.Boolean && !this.question.required) {
      if (this.formConfig.isEditForm()) {
        this.form.controls[this.question.key].setValue(this.question.value);
        this.checkBoxIsChecked = this.question.value;
      }
      else {
        // set default value of checkbox for insert forms
        var defaultValue: boolean;
        if (this.question.defaultValue) {
          defaultValue = true;
        }
        else {
          defaultValue = false;
        }
        this.form.controls[this.question.key].setValue(defaultValue);
        this.checkBoxIsChecked = defaultValue;
      }
    }
    // set default value for radio checkbox
    if (this.question.controlTypeEnum === ControlTypeEnum.RadioBoolean) {
      if (this.formConfig.isEditForm()) {
        // set checkbox status based on question value
        this.form.controls[this.question.key].setValue(this.question.value);
        this.radioCheckboxTrueChecked = this.question.value;
        this.radioCheckboxFalseChecked = !this.question.value;
      }
      else {
        // set default value for insert forms
        var defaultValue: boolean;
        if (this.question.defaultValue) {
          defaultValue = true;
        }
        else {
          defaultValue = false;
        }
        this.form.controls[this.question.key].setValue(defaultValue);
        this.radioCheckboxTrueChecked = defaultValue;
        this.radioCheckboxFalseChecked = !defaultValue;
      }
    }

    // fix angular js changes error
    this.cdr.detectChanges();
  }

  private translateQuestionLabel(): void {
    var translationKey = this.getQuestionLabelKey();
    this.translateService.get(translationKey).subscribe(translatedText => {
      if (translatedText) {
        this.question.translatedLabel = translatedText
      }
    });
  }

  private translateQuestionHint(): void {
    var translationKey = this.getQuestionHintKey();
    this.translateService.get(translationKey).subscribe(translatedText => {
      if (this.translatioSuccessful(translatedText)) {
        this.questionHint = translatedText
      }
    });
  }

  private translatioSuccessful(translatedText: string): boolean {
    if (!translatedText) {
      return false;
    }

    return !translatedText.startsWith('form.');
  }

  private getQuestionLabelKey(): string {
    return 'form.' + StringHelper.firstCharToLowerCase(this.formConfig.type) + '.' + StringHelper.firstCharToLowerCase(this.question.key);
  }

  private getQuestionHintKey(): string {
    return this.getQuestionLabelKey() + '.hint';
  }

  private showLengthHint(): boolean {
    if (this.question.options.maxLength > 0) {
      return true;
    }
    return false;
  }

  private get isValid() { return this.form.controls[this.question.key].valid; }

  private handleRadioButtonChange(): void {
    this.showRequiredLabels = false;
  }

  private getWidthStyle(): string {
    if (!this.question.options.width) {
      return null;
    }
    return `${this.question.options.width}px`;
  }

  // field types
  private isDropdownField(): boolean {
    return this.question.controlTypeEnum == ControlTypeEnum.Dropdown;
  }

  private isDateField(): boolean {
    return this.question.controlTypeEnum == ControlTypeEnum.Date;
  }

  private isBooleanField(): boolean {
    return this.question.controlTypeEnum == ControlTypeEnum.Boolean;
  }

  private isRadioBooleanField(): boolean {
    return this.question.controlTypeEnum == ControlTypeEnum.RadioBoolean;
  }

  private isTextField(): boolean {
    return this.question.controlTypeEnum == ControlTypeEnum.Text;
  }

  private isTextAreaField(): boolean {
    return this.question.controlTypeEnum == ControlTypeEnum.TextArea;
  }

  private isHiddenField(): boolean {
    return this.question.controlTypeEnum == ControlTypeEnum.Hidden;
  }
}