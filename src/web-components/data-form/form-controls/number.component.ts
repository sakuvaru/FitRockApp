import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormControlComponent, ValueValidationResult } from './base-form-control.component';
import { numberHelper } from '../../../lib/utilities';

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
    protected translateService: TranslateService
  ) {
    super(cdr, translateService);
  }

  ngOnInit() {
    this.setCustomValidator();
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setCustomValidator();
    super.ngOnChanges(changes);
  }

  protected getInsertValue(): string {
    return this.question.defaultValue;
  }

  protected getEditValue(): string {
    return this.question.value;
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

      if (!numberHelper.isNumber(value)) {
        // field is not a number
        // if (min value <= 0 || max value >= 0) && number is 0, its all good
        if ((this.getMinNumberValue() <= 0 || this.getMaxNumberValue() >= 0) && (value === 0 || !value)) {
          isValid = true;
        } else {
          isValid = false;
          errorMessageKey = 'form.error.valueIsNotANumber';
        }
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
    if (!this.question.options) {
      return this.maximumNumberValue;
    }

    const definedNumber = this.question.options.maxNumberValue;
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
    if (!this.question.options) {
      return this.miniumNumberValue;
    }

    const definedNumber = this.question.options.minNumberValue;
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
