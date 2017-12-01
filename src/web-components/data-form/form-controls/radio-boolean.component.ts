import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-radio-boolean',
  templateUrl: './radio-boolean.component.html'
})

export class RadioBooleanComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  private radioCheckboxTrueChecked: boolean;
  private radioCheckboxFalseChecked: boolean;
  private showRequiredLabels: boolean = true;

  private trueOptionLabel: string;
  private falseOptionLabel: string;

  private labelsTranslated: boolean = false;

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    this.translateLabels();
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.translateLabels();
    super.ngOnChanges(changes);
  }

  private translateLabels(): void {
    if (this.labelsTranslated) {
      return;
    }

    // translate labels for radio boolean
    if (this.field.options && this.field.options.trueOptionLabel) {
      this.localizationService.get(this.field.options.trueOptionLabel)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(translatedText => {
          if (translatedText && this.field.options) {
            this.trueOptionLabel = translatedText;
          }
        });
    }
    if (this.field.options && this.field.options.falseOptionLabel) {
      this.localizationService.get(this.field.options.falseOptionLabel)
        .takeUntil(this.ngUnsubscribe)
        .subscribe(translatedText => {
          if (translatedText && this.field.options) {
            this.falseOptionLabel = translatedText;
          }
        });
    }
  }

  protected getInsertValue(): boolean {
    let defaultValue: boolean;
    if (this.field.defaultValue) {
      defaultValue = true;
    } else {
      defaultValue = false;
    }
    this.radioCheckboxTrueChecked = defaultValue;
    this.radioCheckboxFalseChecked = !defaultValue;

    return defaultValue;
  }

  protected getEditValue(): boolean {
    const fieldValue = this.field.value;
    
        if (!fieldValue) {
          return this.getInsertValue();
        }
    
        if (!(fieldValue instanceof Boolean)) {
          throw Error(`RadioBoolean field expected value to be 'String', but other type was given`);
        }

    this.radioCheckboxTrueChecked = fieldValue;
    this.radioCheckboxFalseChecked = !fieldValue;

    return fieldValue;
  }

  private handleRadioButtonChange(): void {
    this.showRequiredLabels = false;
  }
}
