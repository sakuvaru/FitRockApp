import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LocalizationService } from '../../../lib/localization';
import { numberHelper } from '../../../lib/utilities';
import { BaseFormControlComponent, ValueValidationResult } from './base-form-control.component';

@Component({
  selector: 'df-number',
  templateUrl: './number.component.html'
})

export class NumberComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  /**
   * Maximum value for numbers (assuming the number is represented by Int32)
   * https://msdn.microsoft.com/en-us/library/system.int32.maxvalue(v=vs.110).aspx
   */
  private readonly maximumNumberValue = 2147483647;

  /**
   * Minimum value for numbers (assuming the number is represented by Int32)
   * https://msdn.microsoft.com/en-us/library/system.int32.minvalue(v=vs.110).aspx
   */
  private readonly miniumNumberValue = -2147483648;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    this.setCustomValidator();
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setCustomValidator();
    super.ngOnChanges(changes);
  }

  protected getInsertValue(): number | undefined {
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return undefined;
    }

    return +defaultFieldValue;
  }

  protected getEditValue(): number | undefined {
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return undefined;
    }

    return +fieldValue;
  }

  private setCustomValidator(): void {
    if (this.customValidator) {
      // no need to set validator if its already been assigned
      return;
    }

    this.customValidator = (value) => {
      let isValid = true;
      let errorMessageKey: string = 'form.error.unknown';
      const translationData: any = {};

      // validate only if number is required
      if (!this.field.required) {
        return new ValueValidationResult(isValid, errorMessageKey, translationData);
      }

      if (!numberHelper.isNumber(value)) {
        isValid = false;
        errorMessageKey = 'form.error.valueIsNotANumber';
      } else {
        // field is a number, but check its min & max values
        const maxValue = this.getMaxNumberValue();
        const minValue = this.getMinNumberValue();

        if (value > maxValue) {
          isValid = false;
          errorMessageKey = 'form.error.invalidMaxNumberValue';
          translationData.number = maxValue;
        }
        if (value < minValue) {
          isValid = false;
          errorMessageKey = 'form.error.invalidMinNumberValue';
          translationData.number = minValue;
        }
      }

      return new ValueValidationResult(isValid, errorMessageKey, translationData);
    };
  }

  private getMaxNumberValue(): number {
    if (!this.field.options) {
      return this.maximumNumberValue;
    }

    const definedNumber = this.field.options.maxNumberValue;
    if (definedNumber === 0) {
      return 0;
    }
    if (definedNumber) {
      if (definedNumber > this.maximumNumberValue) {
        return this.maximumNumberValue;
      }
      return definedNumber;
    }
    return this.maximumNumberValue;
  }

  private getMinNumberValue(): number {
    if (!this.field.options) {
      return this.miniumNumberValue;
    }

    const definedNumber = this.field.options.minNumberValue;
    if (definedNumber === 0) {
      return 0;
    }
    if (definedNumber) {
      if (definedNumber < this.miniumNumberValue) {
        return this.miniumNumberValue;
      }
      return definedNumber;
    }
    return this.miniumNumberValue;
  }
}
