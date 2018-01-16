import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';

import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';


@Component({
  selector: 'df-date-time',
  templateUrl: './date-time.component.html',
})

export class DateTimeComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  private dateInitialized: boolean = false;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService,
    protected dateTimeAdapter: DateTimeAdapter<any>
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.init();
  }

  private init(): void {
    if (this.dateInitialized) {
      return;
    }

    // use locale from service (don't depend on default locale set by angular/material)
    this.dateTimeAdapter.setLocale(this.localizationService.getLocale());
  }

  protected getInsertValue(): Date | string {
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return '';
    }

    if (!(defaultFieldValue instanceof Date)) {
      throw Error(`Date time field expected default value to be 'Date', but other type was given`);
    }

    return defaultFieldValue;
  }

  protected getEditValue(): Date | string {
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return '';
    }

    if (!(fieldValue instanceof Date)) {
      throw Error(`Date time field expected value to be 'Date', but other type was given`);
    }
    return fieldValue;
  }
}
