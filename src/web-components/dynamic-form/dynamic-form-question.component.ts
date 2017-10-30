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

  private isPhoneNumberField(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.PhoneNumber;
  }

  private isDateTime(): boolean {
    return this.question.controlTypeEnum === ControlTypeEnum.DateTime;
  }

}


