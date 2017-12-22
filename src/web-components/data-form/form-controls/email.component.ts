import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent, ValueValidationResult } from './base-form-control.component';
import { stringHelper } from 'lib/utilities';

@Component({
  selector: 'df-email',
  templateUrl: './email.component.html'
})

export class EmailComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setCustomValidator();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.setCustomValidator();
  }

  private setCustomValidator(): void {
    if (this.customValidator) {
      // no need to set validator if its already been assigned
      return;
    }

    this.customValidator = (value) => {
      let isValid = true;
      const errorMessageKey: string = 'form.error.invalidEmail';
      const translationData: any = {};

      if (!stringHelper.isValidEmail(value)) {
        isValid = false;
      }

      return new ValueValidationResult(isValid, errorMessageKey, translationData);
    };
  }

  protected getInsertValue(): string {
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return '';
    }

    if (!((typeof defaultFieldValue === 'string') || (defaultFieldValue instanceof String))) {
      throw Error(`Text field expected default value to be 'String', but other type was given`);
    }

    return defaultFieldValue as string;
  }

  protected getEditValue(): string {
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return '';
    }

    if (!((typeof fieldValue === 'string') || (fieldValue instanceof String))) {
      throw Error(`Text field expected value to be 'String', but other type was given`);
    }

    return fieldValue as string;
  }
}
