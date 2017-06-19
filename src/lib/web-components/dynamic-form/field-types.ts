import { DropdownFieldOption, BaseField } from '../../repository';

export class DropdownField extends BaseField<string> {
  public controlType = 'dropdown';

  constructor(
    options?: {
      value?: string,
      key?: string,
      keyAlias?: string,
      label?: string,
      labelKey?: string,
      required?: boolean,
      hint?: string,
      hintKey?: string,
      width?: number,
      dropdownOptions?: DropdownFieldOption[],
    }) {
    super(options);
  }
}

export class DateField extends BaseField<Date> {
  public controlType = 'date';

  constructor(
    options?: {
      value?: Date,
      key?: string,
      keyAlias?: string,
      label?: string,
      labelKey?: string,
      required?: boolean,
      hint?: string,
      hintKey?: string
    }) {
    super(options);
  }
}

export class BooleanField extends BaseField<boolean> {
  public controlType = 'checkbox';

  constructor(
    options?: {
      value?: boolean,
      key?: string,
      keyAlias?: string,
      label?: string,
      labelKey?: string,
      required?: boolean,
      hint?: string,
      hintKey?: string,
    }) {
    super(options);
  }
}

export class RadioBooleanField extends BaseField<boolean> {
  public controlType = 'radioboolean';

  constructor(
    options?: {
      trueOptionLabel: string,
      falseOptionLabel: string,
      value?: boolean,
      defaultValue?: boolean,
      key?: string,
      keyAlias?: string,
      label?: string,
      labelKey?: string,
      required?: boolean,
      hint?: string,
      hintKey?: string,
    }) {
    super(options);
  }
}

export class TextField extends BaseField<string> {
  public controlType = 'textbox';

  constructor(
    options?: {
      value?: string,
      key?: string,
      keyAlias?: string,
      label?: string,
      labelKey?: string,
      required?: boolean,
      maxLength?: number,
      minLength?: number,
      hint?: string,
      hintKey?: string,
    }) {
    super(options);
  }
}

export class TextAreaField extends BaseField<string> {
  public controlType = 'textarea';

  constructor(
    options?: {
      value?: string,
      key?: string,
      keyAlias?: string,
      label?: string,
      labelKey?: string,
      required?: boolean,
      maxLength?: number,
      minLength?: number,
      hint?: string,
      hintKey?: string,
      maxAutosizeRows?: number,
      minAutosizeRows?: number,
    }) {
    super(options);
  }
}

export class HiddenField extends BaseField<any> {
  public controlType = 'hidden';

  constructor(
    options?: {
      value?: any,
      key?: string,
      keyAlias?: string,
      required?: boolean,
    }) {
    super(options);
  }
}