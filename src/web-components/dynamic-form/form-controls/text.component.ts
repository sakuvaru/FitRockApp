import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-text',
  templateUrl: './text.component.html'
})

export class TextComponent extends BaseFormControlComponent implements OnInit, OnChanges {

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
    return this.question.defaultValue;
  }

  protected getEditValue(): string {
    return this.question.value;
  }
}
