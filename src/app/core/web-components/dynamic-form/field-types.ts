import { BaseField } from './base-field.class';

export class DropdownField extends BaseField<string> {
  controlType = 'dropdown';
  options: { key: string, value: string }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}

export class BooleanField extends BaseField<boolean> {
  controlType = 'checkbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class RadioBooleanField extends BaseField<boolean> {
  controlType = 'radioboolean';
  type: string;

  constructor(
    public trueOptionLabel: string,
    public falseOptionLabel: string,
    options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class TextField extends BaseField<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class TextAreaField extends BaseField<string> {
  controlType = 'textarea';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class HiddenField extends BaseField<string> {
  controlType = 'hidden';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}