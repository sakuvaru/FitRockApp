import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LocalizationService } from '../../../lib/localization';
import { BaseFormControlComponent } from './base-form-control.component';
import { MatDialog } from '@angular/material';
import { MultipleChoiceDialogComponent } from '../dialogs/multiple-choice-dialog.component';

@Component({
  selector: 'df-multiple-choice',
  templateUrl: './multiple-choice.component.html'
})

export class MultipleChoiceComponent extends BaseFormControlComponent implements OnInit, OnChanges {

  constructor(
    protected cdr: ChangeDetectorRef,
    protected localizationService: LocalizationService,
    protected dialog: MatDialog
  ) {
    super(cdr, localizationService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(MultipleChoiceDialogComponent, {
      panelClass: this.config.dialogPanelClass,
      data: { name: 'Test' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  protected getInsertValue(): string {
    return '';
    
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

  protected getEditValue(): string {
    return '';
    
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
}
