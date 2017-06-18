import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './base-field.class';
import { TranslateService } from '@ngx-translate/core';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent implements AfterViewInit {

  @Input() question: BaseField<any>;

  @Input() form: FormGroup;

  @Input() isEditForm: boolean;

  constructor(
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
  }

  private questionLabel: string;

  private questionHint: string;

  private showRequiredLabels: boolean = true;

  private datePickerStartDate = new Date(1980, 0, 1);

  private checkBoxIsChecked: boolean = false;

  private radioCheckboxTrueChecked: boolean;
  private radioCheckboxFalseChecked: boolean;

  ngAfterViewInit() {
    // translation
    this.translateQuestionHint();
    this.translateQuestionLabel();

    // init values
    this.initValues();
  }

  private initValues(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // set default checkbox value to false programatically (it will otherwise treat checkbox as undefined)
    if (this.question.controlType === 'checkbox' && !this.question.required) {
      if (this.isEditForm) {
        this.form.controls[this.question.key].setValue(this.question.value);
        this.checkBoxIsChecked = this.question.value;
      }
      else{
         // set default value of checkbox for insert forms
        this.form.controls[this.question.key].setValue(this.question.defaultValue);
        this.checkBoxIsChecked = this.question.defaultValue;
      }
    }
    // set default value for radio checkbox
    if (this.question.controlType === 'radioboolean') {
      if (this.isEditForm) {
        // set checkbox status based on question value
        this.form.controls[this.question.key].setValue(this.question.value);
        this.radioCheckboxTrueChecked = this.question.value;
        this.radioCheckboxFalseChecked = !this.question.value;
      }
      else {
        // set default value for insert forms
        this.form.controls[this.question.key].setValue(this.question.defaultValue);
        this.radioCheckboxTrueChecked = this.question.value;
        this.radioCheckboxFalseChecked = !this.question.defaultValue;
      }
    }

    // fix angular js changes error
    this.cdr.detectChanges();
  }

  private translateQuestionLabel(): void {
    if (!this.questionLabel) {
      if (this.question.label) {
        // if regular 'label' is set, use it directly without translating
        this.questionLabel = this.question.label;
      }
      else if (this.question.labelKey) {
        // if 'labelKey' is set, translate it
        this.translateService.get(this.question.labelKey).subscribe(key => this.questionLabel = key);
      }
    }
  }

  private translateQuestionHint(): void {
    if (!this.questionHint) {
      if (this.question.hint) {
        // if regular 'hint' is set, use it directly without translating
        this.questionHint = this.question.hint;
      }
      else if (this.question.hintKey) {
        // if 'hintKey' is set, translate it
        this.translateService.get(this.question.hintKey).subscribe(key => this.questionHint = key);
      }
    }
  }

  private showLengthHint(): boolean {
    if (this.question.maxLength > 0) {
      return true;
    }
    return false;
  }

  private get isValid() { return this.form.controls[this.question.key].valid; }

  private handleRadioButtonChange(): void {
    this.showRequiredLabels = false;
  }

  private getWidthStyle(): string {
    if (!this.question.width) {
      return null;
    }
    return `${this.question.width}px`;
  }
}