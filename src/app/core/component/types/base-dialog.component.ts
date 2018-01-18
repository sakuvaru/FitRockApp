import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ComponentDependencyService } from '../component-dependency.service';
import { BaseModuleComponent } from './base-module.component';

@Component({
})
export abstract class BaseDialogComponent<TDialogComponent> extends BaseModuleComponent implements OnInit {

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<TDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    options?: {
      subscribedToRepositoryErrors?: boolean
  }
  ) {
    super(dependencies, options);
  }
  
  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dialogRef.close();
  }
}
