import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ComponentDependencyService } from '../component-dependency.service';
import { BaseModuleComponent } from './base-module.component';

/**
 * Component decorated is required here for base dialog
 */
@Component({
  template: ''
})
export class BaseDialogComponent<TDialogComponent> extends BaseModuleComponent implements OnInit {

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<TDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  
  ) {
    super(dependencies);
  }
  
  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dialogRef.close();
  }
}
