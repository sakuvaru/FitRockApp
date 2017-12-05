import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-date-time',
  templateUrl: './date-time.component.html'
})

export class DateTimeComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
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
