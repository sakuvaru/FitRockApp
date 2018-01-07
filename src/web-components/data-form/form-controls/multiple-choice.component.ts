import { Observable } from 'rxjs/Rx';
import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatSelectionList } from '@angular/material';
import * as _ from 'underscore';

import { LocalizationService } from '../../../lib/localization';
import { DataFormMultipleChoiceFieldConfig, DataFormMultipleChoiceItem } from '../data-form-models';
import { DataFormFieldTypeEnum } from '../data-form.enums';
import { BaseFormControlComponent } from './base-form-control.component';

@Component({
  selector: 'df-multiple-choice',
  templateUrl: './multiple-choice.component.html'
})

export class MultipleChoiceComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  public multipleChoiceItems: DataFormMultipleChoiceItem<any>[] = [];

  private multipleChoiceInitialized: boolean = false;

  private multipleChoiceConfig: DataFormMultipleChoiceFieldConfig<any> | undefined;

  private _selectionList?: MatSelectionList;
  @ViewChild('selectionList') set selectionList(content: MatSelectionList) {
    if (content) {
      this._selectionList = content;
    }
  }

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService,
    protected dialog: MatDialog
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.initMultipleChoice();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.initMultipleChoice();
  }

  initMultipleChoice(): void {
    if (this.multipleChoiceInitialized) {
      return;
    }

    this.multipleChoiceInitialized = true;

    // try getting the configuration for multiple choice field
    if (!this.config.multipleChoiceResolver) {
      throw Error(`Field '${this.field.key}' of '${this.field.fieldType}' type is missing multiple choice resolver`);
    }

    const multipleChoiceConfig = this.config.multipleChoiceResolver(this.field, this.field.internalProperties.item);

    if (!multipleChoiceConfig) {
      throw Error(`Field '${this.field.key}' of '${DataFormFieldTypeEnum[this.field.fieldType]}' type does not contain required configuration object`);
    }

    // get multiple choice items
    multipleChoiceConfig.assignedItems(this.field, this.field.internalProperties.item)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(items => {
        this.multipleChoiceItems = items;

        // see if anything changed
        this.reloadItemTranslations();

        // update field's json value
        this.updateControlValueWithJson();
      });

    // subscribe to value change observable
    multipleChoiceConfig.itemChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe(changedItem => {
        // try to find  existing item 
        let item = this.multipleChoiceItems.find(m => m.identifier === changedItem.identifier);

        if (item) {
          // edit existing item
          item = changedItem;
        } else {
          // add new item
          this.multipleChoiceItems.push(changedItem);
        }

        // update field's json value
        this.updateControlValueWithJson();
      });

    // see if anything changed
    this.reloadItemTranslations();

    // set config
    this.multipleChoiceConfig = multipleChoiceConfig;
  }

  editSelected(): void {
    if (!this.multipleChoiceConfig) {
      throw Error(`Incorrect configuration for '${this.field.key}'`);
    }

    this.multipleChoiceConfig.onEditSelected(this.getSelectedItems());
  }

  removeSelected(): void {
    if (this._selectionList && this._selectionList.selectedOptions) {
      this._selectionList.selectedOptions.selected.forEach(selectedOption => {
        this.removeItem(selectedOption.value);
      });
    }

    // update field's json value
    this.updateControlValueWithJson();
  }

  multipleChoiceButtonClick(): void {
    if (!this.multipleChoiceConfig) {
      throw Error(`Incorrect configuration for '${this.field.key}'`);
    }

    this.multipleChoiceConfig.onDialogClick(this.field, this.field.internalProperties.item);
  }

  protected getInsertValue(): any[] {
    return this.getFieldValue();

    /*
    const defaultFieldValue = this.field.defaultValue;

    if (!defaultFieldValue) {
      return '';
    }

    if (!((typeof defaultFieldValue === 'string') || (defaultFieldValue instanceof String))) {
      throw Error(`Text field expected default value to be 'String', but other type was given`);
    }

    return defaultFieldValue as string;
    */
  }

  protected getEditValue(): any[] {
    // make sure the control value is up-to-date because this can be called AFTER the multiple items are loaded
    this.updateControlValueWithJson();

    return this.getFieldValue();

    /*
    const fieldValue = this.field.value;

    if (!fieldValue) {
      return '';
    }

    if (!((typeof fieldValue === 'string') || (fieldValue instanceof String))) {
      throw Error(`Text field expected value to be 'String', but other type was given`);
    }

    return fieldValue as string;
    */
  }

  private reloadItemTranslations(): void {
  }

  private getSelectedItems(): DataFormMultipleChoiceItem<any>[] {
    if (!this._selectionList) {
      return [];
    }

    const items: DataFormMultipleChoiceItem<any>[] = [];
    this._selectionList.selectedOptions.selected.map(m => {
      const item = this.multipleChoiceItems.find(s => s.identifier === m.value);
      if (!item) {
        throw Error(`Cannot fetch full object of selected items for item '${m.value}'`);
      }

      items.push(item);
    });

    return items;
  }

  private getFieldValue(): any[] {
    if (!this.multipleChoiceItems) {
      return [];
    }

    return this.multipleChoiceItems.map(item => item.rawValue);
  }

  private updateControlValueWithJson(): void {
    this.formGroup.controls[this.field.key].setValue(this.getFieldValue());
  }

  private removeItem(identifier: string): void {
    if (!this.multipleChoiceConfig) {
      throw Error(`Incorrect configuration for '${this.field.key}'`);
    }

    const selectedItem = this.multipleChoiceItems.find(m => m.identifier === identifier);

    this.multipleChoiceItems = _.reject(this.multipleChoiceItems, function (item) { return item.identifier === identifier; });
  }
}
