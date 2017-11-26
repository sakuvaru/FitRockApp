import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-text',
  templateUrl: './text.component.html'
})

export class TextComponent extends BaseFormControlComponent implements OnInit, OnChanges {

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

  protected getInsertValue(): string {
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return '';
    }

    if (!(defaultFieldValue instanceof String)) {
      throw Error(`Text field expected default value to be 'String', but other type was given`);
    }

    return defaultFieldValue;
  }

  protected getEditValue(): string {
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return '';
    }

    if (fieldValue || !(fieldValue instanceof String)) {
      throw Error(`Text field expected value to be 'String', but other type was given`);
    }

    return fieldValue;
  }
}
