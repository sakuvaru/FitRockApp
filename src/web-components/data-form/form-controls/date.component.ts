import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

const DateFormat = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'df-date',
  templateUrl: './date.component.html',
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: DateFormat },
  ],
})

export class DateComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  private dateInitialized: boolean = false;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService,
    private adapter: DateAdapter<any>
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
    this.adapter.setLocale(this.localizationService.getLocale());
  }

  protected getInsertValue(): string {
    const defaultFieldValue = this.field.defaultValue;

    return defaultFieldValue as string;
  }

  protected getEditValue(): string {
    const fieldValue = this.field.value;

    return fieldValue as string;
  }
}
