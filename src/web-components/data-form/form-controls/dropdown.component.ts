import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';
import { DataFieldDropdownOption } from '../data-form-models';

@Component({
  selector: 'df-dropdown',
  templateUrl: './dropdown.component.html'
})

export class DropdownComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  private listOptionsResolved: boolean = false;

  /**
   * This field identifies a dropdown value which should be empty
   */
  private readonly optionNoValueName: string = 'optionNoValue';

  /**
   * Key used to translate no option field
   */
  private readonly optionNoValueTranslationKey: string = 'form.shared.noValue';

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    this.initDropdownOptions();
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initDropdownOptions();
    super.ngOnChanges(changes);
  }

  private initDropdownOptions(): void {
    if (this.listOptionsResolved) {
      return;
    }

    if (this.field.options && this.field.options.listOptions) {
      this.field.options.listOptions.forEach(option => {

        let optionInList: DataFieldDropdownOption | undefined;
        if (this.field && this.field.options && this.field.options.listOptions) {
          optionInList = this.field.options.listOptions.find(m => m.value === option.value);
        }

        if (!optionInList) {
          console.warn(`Could not find option '${option.value}' in dropdown list of field '${this.field.key}'`);
          return;
        }

        if (this.config.optionLabelResolver) {
          // resolve option label using custom function if available
          this.config.optionLabelResolver(this.field, option.name)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(resolvedName => {
              if (optionInList) {
                optionInList.name = resolvedName;
              }
            });
        }  else if (option.name === this.optionNoValueName) {
           // check if the value represents 'noValue' option
           this.localizationService.get(this.optionNoValueTranslationKey)
           .takeUntil(this.ngUnsubscribe)
           .subscribe(translatedText => {
             if (optionInList) {        
                 optionInList.name = translatedText;
             }
           });
        } else {
          // or try resolve label using the default translations
          this.localizationService.get(option.name)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(translatedText => {
              if (optionInList) {        
                  optionInList.name = translatedText;
              }
            });
        }
      });
      this.listOptionsResolved = true;
    }
  }

  protected getInsertValue(): string | number | boolean | Date | undefined  {
    return this.field.defaultValue;
  }

  protected getEditValue(): string | number | boolean | Date | undefined  {
    return this.field.value;
  }
}
