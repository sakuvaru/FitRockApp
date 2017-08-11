// common
import { Component, Input, Output, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentConfig } from '../../../../core';

// required by component
import { DataTableConfig, AlignEnum } from '../../../../../web-components/data-table';
import { MD_DIALOG_DATA } from '@angular/material';
import { ProgressItem } from '../../../../models';
import { FormConfig } from '../../../../../web-components/dynamic-form';

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
  }

  ngOnInit() {
    super.ngOnInit();
    
    super.startGlobalLoader();

    this.dependencies.itemServices.progressItemService.editForm(this.item.id)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(form => {
        form.onAfterUpdate((response) => {
          this.itemWasUpdated = true;
          this.close();
        });
        form.onBeforeSave(() => super.startGlobalLoader());
        form.onAfterSave(() => super.stopGlobalLoader());
        form.onBeforeDelete(() => super.startGlobalLoader());
        form.onError(() => super.stopGlobalLoader());
        form.onAfterDelete((response) => {
          this.idOfDeletedItem = response.deletedItemId;
          this.itemWasDeleted = true;
          this.stopGlobalLoader();
          this.close();
        });

        this.formConfig = form.build();
        super.stopGlobalLoader();
      },
      error => super.handleError(error));
  }

  private close(): void {
    this.dependencies.tdServices.dialogService.closeAll();
  }
}