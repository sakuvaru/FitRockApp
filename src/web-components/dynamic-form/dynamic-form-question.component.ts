import { Component, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormField, ControlTypeEnum } from '../../lib/repository';
import { FormConfig } from './form-config.class';
import { BaseWebComponent } from '../base-web-component.class';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
  selector: 'df-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent extends BaseWebComponent {

  private _question: FormField;

  @Input('question')
  set question(value: FormField) {
    if (value.controlTypeEnum === ControlTypeEnum.Unknown) {
      console.warn(`Field '${value.key}' is using unsupported field type`);
    }
    this._question = value;
  }
  get question() {
    return this._question;
  }

  @Input() form: FormGroup;
  @Input() formConfig: FormConfig<any>;

  constructor(
  ) {
    super();
  }

  // ----------------------- Field types ------------------------ //

  isDropdownField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Dropdown;
  }

  isDateField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Date;
  }

  isBooleanField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Boolean;
  }

  isRadioBooleanField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.RadioBoolean;
  }

  isTextField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Text;
  }

  isTextAreaField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.TextArea;
  }

  isHiddenField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Hidden;
  }

  isNumberField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.Number;
  }

  isPhoneNumberField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.PhoneNumber;
  }

  isDateTime(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.DateTime;
  }

}


