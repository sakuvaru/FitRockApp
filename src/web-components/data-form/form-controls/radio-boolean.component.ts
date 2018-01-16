import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Observable';

import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-radio-boolean',
  templateUrl: './radio-boolean.component.html'
})

export class RadioBooleanComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  public radioCheckboxTrueChecked: boolean;
  public radioCheckboxFalseChecked: boolean;
  public showRequiredLabels: boolean = true;

  public trueOptionLabel: string;
  public falseOptionLabel: string;

  public labelsTranslated: boolean = false;

  public wrappers: WrapperValue[] = [];

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

  handleRadioButtonChange(): void {
    this.showRequiredLabels = false;
  }

  private translateLabels(): void {
    if (this.labelsTranslated) {
      return;
    }

    // init wrappers
    const observables: Observable<any>[] = [];

    if (this.field.options && this.field.options.trueOptionLabel) {
      observables.push(this.localizationService.get(this.field.options.trueOptionLabel)
        .map(translatedText => {
          if (translatedText && this.field.options) {
            this.trueOptionLabel = translatedText;
          }
        }));
    } else {
      observables.push(Observable.of(undefined).map(() => {
        this.trueOptionLabel = 'Not translated';
      }));
    }

    if (this.field.options && this.field.options.falseOptionLabel) {
      observables.push(this.localizationService.get(this.field.options.falseOptionLabel)
        .map(translatedText => {
          if (translatedText && this.field.options) {
            this.falseOptionLabel = translatedText;
          }
        }));
    } else {
      observables.push(Observable.of(undefined).map(() => {
        this.falseOptionLabel = 'Not translated';
      }));
    }

    const zippedObservable = observableHelper.zipObservables(observables).map(() => {
      // init wrappers
      this.wrappers = [
        new WrapperValue(this.trueOptionLabel, true),
        new WrapperValue(this.falseOptionLabel, false)
      ];
    })
      .takeUntil(this.ngUnsubscribe)
      .subscribe();
  }

  protected getInsertValue(): boolean {
    // set default checkbox value to false programatically (it will otherwise treat checkbox as undefined)
    const defaultFieldValue = this.field.defaultValue;

    if (defaultFieldValue && !this.isBoolean(defaultFieldValue)) {
      throw Error(`Radio Boolean field expected value to be 'Boolean', but other type was given`);
    }

    if (defaultFieldValue) {
      this.radioCheckboxTrueChecked = true;
      this.radioCheckboxFalseChecked = false;
      return true;
    } else {
      this.radioCheckboxTrueChecked = false;
      this.radioCheckboxFalseChecked = true;
      return false;
    }
  }

  protected getEditValue(): boolean {
    const fieldValue = this.field.value;

    if (fieldValue && !this.isBoolean(fieldValue)) {
      throw Error(`Radio Boolean field expected value to be 'Boolean', but other type was given`);
    }

    if (fieldValue) {
      this.radioCheckboxTrueChecked = true;
      this.radioCheckboxFalseChecked = false;
      return true;
    } else {
      this.radioCheckboxTrueChecked = false;
      this.radioCheckboxFalseChecked = true;
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

class WrapperValue {
  constructor(
    public label: string,
    public value: boolean
  ) { }
}
