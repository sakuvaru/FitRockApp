import { Component, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { DataFormField } from './data-form-models';
import { DataFormFieldTypeEnum } from './data-form.enums';
import { DataFormConfig } from './data-form.config';
import { BaseWebComponent } from '../base-web-component.class';

// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details

@Component({
  selector: 'data-form-field',
  templateUrl: './data-form-field.component.html'
})

export class DataFormFieldComponent extends BaseWebComponent {

  @Input() fields: DataFormField[];
  @Input() field: DataFormField;
  @Input() formGroup: FormGroup;
  @Input() config: DataFormConfig;

  // ----------------------- Field types ------------------------ //

  isDropdownField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.Dropdown;
  }

  isDateField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.Date;
  }

  isBooleanField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.Boolean;
  }

  isRadioBooleanField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.RadioBoolean;
  }

  isTextField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.Text;
  }

  isTextAreaField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.TextArea;
  }

  isHiddenField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.Hidden;
  }

  isNumberField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.Number;
  }

  isPhoneNumberField(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.PhoneNumber;
  }

  isDateTime(): boolean {
    return this.field.fieldType === DataFormFieldTypeEnum.DateTime;
  }

}


