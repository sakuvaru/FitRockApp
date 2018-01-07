import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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

  protected getInsertValue(): string | number | boolean | Date | undefined | object {
    // set value only if standard 'value' is not set (value could be set for e.g. hidden field)
    if (!this.field.value) {
      return this.field.defaultValue;
    }
    return this.field.value;
  }

  protected getEditValue(): string | number | boolean | Date | undefined | object {
    return this.field.value;
  }
}
