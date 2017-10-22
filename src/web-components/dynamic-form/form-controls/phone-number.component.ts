import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  private activePhoneFormat: PhoneFormat | undefined;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected translateService: TranslateService
  ) {
    super(cdr, translateService);
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
    return this.question.defaultValue;
  }

  protected getEditValue(): string {
    return this.question.value;
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
