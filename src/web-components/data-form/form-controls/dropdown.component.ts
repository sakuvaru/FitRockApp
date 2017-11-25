import { Component, Input, AfterViewInit, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormControlComponent } from './base-form-control.component';
import { DropdownFieldOption } from '../../../lib/repository';

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
    protected translateService: TranslateService
  ) {
    super(cdr, translateService);
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

    if (this.question.options && this.question.options.listOptions) {
      this.question.options.listOptions.forEach(option => {

        let optionInList: DropdownFieldOption | undefined;
        if (this.question && this.question.options && this.question.options.listOptions) {
          optionInList = this.question.options.listOptions.find(m => m.value === option.value);
        }

        if (!optionInList) {
          console.warn(`Could not find option '${option.value}' in dropdown list of field '${this.question.key}'`);
          return;
        }

        if (this.formConfig.optionLabelResolver) {
          // resolve option label using custom function if available
          this.formConfig.optionLabelResolver(this.question, option.name)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(resolvedName => {
              if (optionInList) {
                optionInList.name = resolvedName;
              }
            });
        }  else if (option.name === this.optionNoValueName) {
           // check if the value represents 'noValue' option
           this.translateService.get(this.optionNoValueTranslationKey)
           .takeUntil(this.ngUnsubscribe)
           .subscribe(translatedText => {
             if (optionInList) {        
                 optionInList.name = translatedText;
             }
           });
        } else {
          // or try resolve label using the default translations
          this.translateService.get(option.name)
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

  protected getInsertValue(): any {
    return this.question.defaultValue;
  }

  protected getEditValue(): any {
    return this.question.value;
  }
}
