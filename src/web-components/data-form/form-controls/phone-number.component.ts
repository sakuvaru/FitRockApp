import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-phone-number',
  templateUrl: './phone-number.component.html'
})

export class PhoneNumberComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  private phoneFormats: PhoneFormat[] = [
    new PhoneFormat(PhoneFormatType.International, '+', ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]),
    new PhoneFormat(PhoneFormatType.US, '+1', ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/])
  ];

  public activePhoneFormat: PhoneFormat | undefined;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    this.initPhoneComponent();
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initPhoneComponent();
    super.ngOnChanges(changes);
  }

  private initPhoneComponent(): void {
    // set active format
    // right now it always uses CZ format, but it can be extended in future to include US number 
    // by preferrably letting user choose what format should be used
    this.activePhoneFormat = this.phoneFormats.find(m => m.type === PhoneFormatType.International);
  }

  protected getInsertValue(): string {
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return '';
    }

    if (!(defaultFieldValue instanceof String)) {
      throw Error(`PhoneNumber field expected default value to be 'String', but other type was given`);
    }

    return defaultFieldValue;
  }

  protected getEditValue(): string {
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return '';
    }

    if (fieldValue || !(fieldValue instanceof String)) {
      throw Error(`PhoneNumber field expected value to be 'String', but other type was given`);
    }

    return fieldValue;
  }
}

enum PhoneFormatType {
  International,
  US
}

class PhoneFormat {
  constructor(
    public type: PhoneFormatType,
    public inputPrefix: string,
    public mask: (string | RegExp)[] 
  ) {}
}
