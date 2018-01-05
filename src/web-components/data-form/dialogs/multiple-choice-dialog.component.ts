import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { BaseWebComponent } from '../../base-web-component.class';
import { TdDialogService } from '@covalent/core';

@Component({
  templateUrl: 'multiple-choice-dialog.component.html'
})
export class MultipleChoiceDialogComponent extends BaseWebComponent implements OnInit {

  constructor(
    private dialogService: TdDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();

  }

  ngOnInit() {
  }

  public close(): void {
   // this.dialogService.closeAll();
  }
}
