import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-hidden',
  templateUrl: './hidden.component.html'
})

export class HiddenComponent extends BaseFormControlComponent implements OnInit, OnChanges {

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

  protected getInsertValue(): any {
    // set value only if standard 'value' is not set (value could be set for e.g. hidden field)
    if (!this.question.value) {
      return this.question.defaultValue;
    }
    return this.question.value;
  }

  protected getEditValue(): any {
    return this.question.value;
  }
}
