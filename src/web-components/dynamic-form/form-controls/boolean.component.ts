import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-boolean',
  templateUrl: './boolean.component.html'
})

export class BooleanComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  private checkBoxIsChecked: boolean = false;

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

  protected getInsertValue(): boolean {
    // set default checkbox value to false programatically (it will otherwise treat checkbox as undefined)
    if (!this.question.required) {
      let defaultValue: boolean;
      if (this.question.defaultValue) {
        defaultValue = true;
      } else {
        defaultValue = false;
      }

      this.checkBoxIsChecked = defaultValue;
      return defaultValue;
    }
    this.checkBoxIsChecked = this.question.defaultValue;
    return this.question.defaultValue;
  }

  protected getEditValue(): boolean {
    if (!this.question.required) {
      this.checkBoxIsChecked = this.question.value;
      return this.question.value;
    }
    this.checkBoxIsChecked = this.question.defaultValue;
    return this.question.defaultValue;
  }
}
