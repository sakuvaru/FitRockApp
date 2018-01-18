import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { BaseComponent } from './base.component';
import { ComponentDependencyService } from './component-dependency.service';
import { ComponentSetup } from './component-setup.class';

@Component({
})
export class BaseDialogComponent<TDialogComponent> extends BaseComponent implements OnInit {

  constructor(
    protected dependencies: ComponentDependencyService,
    protected dialogRef: MatDialogRef<TDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dependencies);
  }

  setup(): ComponentSetup {
    return new ComponentSetup({
      initialized: true,
      isNested: true
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public close(): void {
    this.dialogRef.close();
  }
}
