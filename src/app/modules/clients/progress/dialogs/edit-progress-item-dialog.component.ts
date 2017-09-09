// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../../web-components/data-table';
import { MD_DIALOG_DATA } from '@angular/material';
import { ProgressItem } from '../../../../models';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { Observable } from 'rxjs/Rx';

@Component({
  templateUrl: 'edit-progress-item-dialog.component.html'
})
export class EditProgressItemDialog extends BaseComponent implements OnInit {

  private formConfig: FormConfig<ProgressItem>;

  public item: ProgressItem;
  public idOfDeletedItem: number;
  public itemWasDeleted: boolean = false;
  public itemWasUpdated: boolean = false;

  constructor(
    protected dependencies: ComponentDependencyService,
    @Inject(MD_DIALOG_DATA) public data: any
  ) {
    super(dependencies)
    this.item = data;

    super.isDialog();
  }

  ngOnInit() {
    super.ngOnInit();

    super.subscribeToObservable(this.getFormObservable());
  }

  private getFormObservable(): Observable<any> {
    return this.dependencies.itemServices.progressItemService.editForm(this.item.id)
      .takeUntil(this.ngUnsubscribe)
      .map(form => {
        form.onAfterUpdate((response) => {
          this.itemWasUpdated = true;
          this.close();
        });

        form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
        form.onAfterDelete((response) => {
          this.idOfDeletedItem = response.deletedItemId;
          this.itemWasDeleted = true;
          this.close();
        });

        this.formConfig = form.build();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}