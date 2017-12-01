import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-text-area',
  templateUrl: './text-area.component.html'
})

export class TextAreaComponent extends BaseFormControlComponent implements OnInit, OnChanges {

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

  protected getInsertValue(): string {
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return '';
    }

    if (!(defaultFieldValue instanceof String)) {
      throw Error(`TextArea field expected default value to be 'String', but other type was given`);
    }

    return defaultFieldValue;
  }

  protected getEditValue(): string {
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return '';
    }

    if (fieldValue || !(fieldValue instanceof String)) {
      throw Error(`TextArea field expected value to be 'String', but other type was given`);
    }

    return fieldValue;
  }
}

