import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-boolean',
  templateUrl: './boolean.component.html'
})

export class BooleanComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  private checkBoxIsChecked: boolean = false;

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

  protected getInsertValue(): boolean {
    // set default checkbox value to false programatically (it will otherwise treat checkbox as undefined)
    const defaultFieldValue = this.field.defaultValue;

    if (!this.field.required) {
      let defaultValue: boolean;
      if (defaultFieldValue) {
        defaultValue = true;
      } else {
        defaultValue = false;
      }

      this.checkBoxIsChecked = defaultValue;
      return defaultValue;
    }

    if (!(defaultFieldValue instanceof Boolean)) {
      throw Error(`Boolean field expected default value to be 'Boolean', but other type was given`);
    }
    this.checkBoxIsChecked = defaultFieldValue;
    return defaultFieldValue;
  }

  protected getEditValue(): boolean {
    const fieldValue = this.field.value;
    const defaultFieldValue = this.field.defaultValue;

    if (!this.field.required) {
      if (!(fieldValue instanceof Boolean)) {
        throw Error(`Boolean field expected value to be 'Boolean', but other type was given`);
      }
      this.checkBoxIsChecked = fieldValue;
      return fieldValue;
    }

    if (!(defaultFieldValue instanceof Boolean)) {
      throw Error(`Boolean field expected default value to be 'Boolean', but other type was given`);
    }

    this.checkBoxIsChecked = defaultFieldValue;
    return defaultFieldValue;
  }
}
