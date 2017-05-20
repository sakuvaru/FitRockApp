import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from './base-field.class';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent {

  @Input() question: BaseField<any>;

  @Input() form: FormGroup;

  private showLengthHint(): boolean{
    if (this.question.maxLength > 0){
      return true;
    }
    return false;
  }

  get isValid() { return this.form.controls[this.question.key].valid; }
}