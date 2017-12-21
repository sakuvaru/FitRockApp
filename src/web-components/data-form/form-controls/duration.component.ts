import { FormControl } from '@angular/forms';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LocalizationService } from '../../../lib/localization';
import { numberHelper } from '../../../lib/utilities';
import { BaseFormControlComponent, ValueValidationResult } from './base-form-control.component';
import { ViewChild } from '@angular/core/src/metadata/di';

@Component({
  selector: 'df-duration',
  templateUrl: './duration.component.html'
})

export class DurationComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  /**
   * Maximum value for numbers 
   */
  private readonly maximumNumberValue = 10000;

  /**
   * Minimum value for numbers 
   */
  private readonly miniumNumberValue = 1;

  private durationInitialized: boolean = false;

  public hoursControl = new FormControl();
  public minutesControl = new FormControl();

  /**
   * This field represents value that is saved in db
   */
  public durationValueMinutes: number = 0;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    this.setCustomValidator();
    super.ngOnInit();
    this.initControl();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setCustomValidator();
    super.ngOnChanges(changes);
    this.initControl();
  }

  private initControl(): void {
    if (this.durationInitialized) {
      return;
    }

    this.durationInitialized = true;

    this.initDurationValues();
    
    this.hoursControl.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(value => {
        this.updateDurationValue();
        this.hours = value;
      });

      this.minutesControl.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .subscribe(value => {
        this.updateDurationValue();
        this.minutes = value;
      });
  }

  protected getInsertValue(): number {
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return 0;
    }

    return +defaultFieldValue;
  }

  protected getEditValue(): number {
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return 0;
    }

    return +fieldValue;
  }

  private updateDurationValue(): void {
    if (!this.field || !this.formGroup) {
      return;
    }

    let minutes = 0;
    if (this.hoursControl.value > 0) {
      minutes = this.hoursControl.value * 60;
    }
    this.durationValueMinutes = minutes + this.minutesControl.value;

    // set duration to hidden field
    this.formGroup.controls[this.field.key].setValue(this.durationValueMinutes);
  }

  private initDurationValues(): void {
    if (!this.field.value) {
      return;
    }

    let minutes = +this.field.value;

    if (!minutes) {
      return;
    }

    let calculatedMinutes: number = 0;
    let calculatedHours: number = 0;

    while (minutes >= 60) {
      calculatedHours++;
      minutes = minutes - 60;
    }

    // whats left is number of minutes
    calculatedMinutes = minutes;

    // set values
    this.hoursControl.setValue(calculatedHours);
    this.minutesControl.setValue(calculatedMinutes);
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
    return this.maximumNumberValue;
  }

  private getMinNumberValue(): number {
      return this.miniumNumberValue;
  }
}

enum TimeType {
  Minutes,
  Hours,
}
