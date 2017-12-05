import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
    const defaultFieldValue = this.field.defaultValue;

    if (defaultFieldValue && !this.isBoolean(defaultFieldValue)) {
      throw Error(`Boolean field expected value to be 'Boolean', but other type was given`);
    }

    if (defaultFieldValue) {
      this.checkBoxIsChecked = true;
      return true;
    } else {
      this.checkBoxIsChecked = false;
      return false;
    }
  }

  protected getEditValue(): boolean {
    const fieldValue = this.field.value;

    if (fieldValue && !this.isBoolean(fieldValue)) {
      throw Error(`Boolean field expected value to be 'Boolean', but other type was given`);
    }

    if (fieldValue) {
      this.checkBoxIsChecked = true;
      return true;
    } else {
      this.checkBoxIsChecked = false;
      return false;
    }
  }

  private isBoolean(value: any): boolean {
    if (typeof (value) === 'boolean') {
      // variable is a boolean
      return true;
    }
    return false;
  }
}
