import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
    if (this.question.defaultValue) {
      return new Date(this.question.defaultValue);
    }
    return '';
  }

  protected getEditValue(): Date | string {
    if (this.question.rawValue) {
      return (new Date(this.question.rawValue));
    }
    return '';
  }
}
