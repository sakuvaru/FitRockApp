import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-date',
  templateUrl: './date.component.html'
})

export class DateComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  constructor(
    protected cdr: ChangeDetectorRef,
    protected translateService: TranslateService
  ) {
    super(cdr, translateService);
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
