import { Component, Input, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './base-field.class';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent implements AfterViewInit {

  @Input() question: BaseField<any>;

  @Input() form: FormGroup;

  private showRequiredLabels: boolean = true;

  private datePickerStartDate = new Date(1980, 0, 1);

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.

    // set default checkbox value to false programatically (it will otherwise treat checkbox as undefined)
    if (this.question.controlType === 'checkbox' && !this.question.required) {
      if (!this.question.value) {
        this.form.controls[this.question.key].setValue(false);
      }
    }
    // set default value for radio checkbox
    else if (this.question.controlType === 'radioboolean' && !this.question.required) {
      if (!this.question.value) {
        this.form.controls[this.question.key].setValue(false);
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

  private handleRadioButtonChange(): void{
    this.showRequiredLabels = false;
  }
}