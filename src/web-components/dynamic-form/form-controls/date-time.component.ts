import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-date-time',
  templateUrl: './date-time.component.html'
})

export class DateTimeComponent extends BaseFormControlComponent implements OnInit, OnChanges {

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
