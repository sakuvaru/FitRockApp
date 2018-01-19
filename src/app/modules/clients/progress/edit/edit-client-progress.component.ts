import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as _ from 'underscore';

import { stringHelper } from '../../../../../lib/utilities';
import { DataFormComponent, DataFormConfig } from '../../../../../web-components/data-form';
import { DataTableComponent, DataTableConfig, IDynamicFilter } from '../../../../../web-components/data-table';
import { AppConfig } from '../../../../config';
import { ComponentDependencyService } from '../../../../core';
import { ProgressItem } from '../../../../models';
import { ProgressItemType } from '../../../../models';
import { BaseClientModuleComponent } from '../../base-client-module.component';
import { EditProgressItemDialogComponent } from '../dialogs/edit-progress-item-dialog.component';
import { NewClientProgressItemTypeDialogComponent } from '../dialogs/new-client-progress-item-type-dialog.component';
import { SelectProgressTypeDialogComponent } from '../dialogs/select-progress-type-dialog.component';

@Component({
    selector: 'mod-edit-client-progress',
    templateUrl: 'edit-client-progress.component.html'
})
export class EditClientProgressComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    public formConfig: DataFormConfig;
    public dataTableConfig: DataTableConfig;
    public progressItemTypes: ProgressItemType[];

    @ViewChild(DataTableComponent) progressItemsDataTable: DataTableComponent;
    @ViewChild(DataFormComponent) progressItemForm: DataFormComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.client) {
            this.init();
        }
    }

    handleDeleteType(progressItemType: ProgressItemType): void {
        super.subscribeToObservable(this.getDeleteProgressTypeObservable(progressItemType));
    }

    private init(): void {
        this.initProgressItemsForm();
        this.initDataList();
        super.subscribeToObservables(this.getObservables());
    }

    private getObservables(): Observable<void>[] {
        const observables: Observable<void>[] = [];
        observables.push(this.getProgressTypesObservable());
        return observables;
    }

    private initProgressItemsForm(): void {
        this.formConfig = this.dependencies.itemServices.progressItemService.buildInsertForm({
            formDefinitionQuery: this.dependencies.itemServices.progressItemService.insertFormQuery().withData('clientId', this.client.id)
        })
            .wrapInCard(false)
            .configField((field, item) => {
                if (field.key === 'ClientId') {
                    field.value = this.client.id;
                }
                return Observable.of(field);
            })
            .onAfterInsert(() => {
                this.reloadDataList();
            })
            .clearFormAfterSave(true)
            .onFieldValueChange((fields, changedField, newValue) => {
                const changeResult = Observable.of(undefined);
                // set extra translation value for measurement value based on currently selected type
                // process for changing the measurement type
                if (changedField.key !== 'ProgressItemTypeId') {
                    return changeResult;
                }

                // get option with the value === newValue 
                if (!changedField.options || !changedField.options.listOptions) {
                    return changeResult;
                }

                const listOption = changedField.options.listOptions.find(m => m.value === newValue);
                const measurementValueField = fields.find(m => m.key === 'Value');

                if (!measurementValueField) {
                    return changeResult;
                }

                if (!listOption) {
                    // option is not in the list, use the default label
                    return super.translate('form.progressItem.value')
                        .map(translation => {
                            measurementValueField.label = translation;
                        })
                        .flatMap(() => changeResult);
                } else {
                    // set new custom translation label
                    const translationData: any = {};
                    const unitCode = listOption.extraDataJson.unit;
                    return super.translate('module.progressItemUnits.' + unitCode)
                        .flatMap(unitTranslation => {
                            translationData.unit = unitTranslation;
                            return super.translate('form.progressItem.valueWithUnit', translationData)
                                .map(translation => {
                                    measurementValueField.label = stringHelper.capitalizeText(translation);
                                });
                        })
                        .flatMap(() => changeResult);
                }
            })
            .build();
    }

    private getProgressTypesObservable(): Observable<void> {
                return this.dependencies.itemServices.progressItemTypeService.items()
                    .byCurrentUser()
                    .whereEquals('ClientId', this.client.id)
                    .get()
            .map((response) => {
                this.progressItemTypes = response.items;
            });
    }

    private initDataList(): void {
        this.dataTableConfig = this.dependencies.itemServices.progressItemService.buildDataTable(
            (query, search) => {
                return query
                    .includeMultiple(['ProgressItemType', 'ProgressItemType.ProgressItemUnit'])
                    .whereEquals('ClientId', this.client.id);
            }
            , { enableDelete: true })
            .withFields([
                {
                    value: (item) =>
                        item.progressItemType.translateValue
                            ? super.translate('module.progressItemTypes.globalTypes.' + item.progressItemType.codename)
                            : item.progressItemType.typeName
                    ,
                    name: (item) => super.translate('module.progressItemTypes.typeName'),
                    hideOnSmallScreen: false
                },
                {
                    name: (item) => super.translate('module.progressItemTypes.value'),
                    value: (item) => item.value.toString(),
                    sortKey: 'Value',
                    hideOnSmallScreen: false
                },
                {
                    value: (item) => super.translate('module.progressItemUnits.' + item.progressItemType.progressItemUnit.unitCode),
                    name: (item) => super.translate('module.progressItemTypes.unit'),
                    hideOnSmallScreen: false
                },
                {
                    value: (item) => super.formatDate(item.measurementDate),
                    name: (item) => super.translate('module.progressItemTypes.measurementDate'),
                    sortKey: 'MeasurementDate',
                    hideOnSmallScreen: true
                },
            ])
            .withDynamicFilters(
            (search) => this.dependencies.itemServices.progressItemTypeService.getProgressItemTypeWithCountDto(this.client.id, undefined)
                .get()
                .map(response => {
                    const filters: IDynamicFilter<ProgressItem>[] = [];
                    response.items.forEach(type => {
                        filters.push(({
                            guid: type.id.toString(),
                            name: type.translateValue ? super.translate('module.progressItemTypes.globalTypes.' + type.codename) : Observable.of(type.typeName),
                            query: (query) => {
                                return query.whereEquals('ProgressItemTypeId', type.id);
                            },
                            count: type.progressItemsCount
                        }));
                    });
                    return filters;
                })
            )
            .withButton({
                icon: 'edit',
                tooltip: (item) => super.translate('shared.edit'),
                action: (item) => this.openEditProgressItemDialog(item)
            })
            .build();
    }

    public openAddNewProgressItemTypeDialog(): void {
        const dialog = this.dependencies.tdServices.dialogService.open(NewClientProgressItemTypeDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: {
                clientId: this.client.id
            }
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.createdProgressItemType) {
                // reload form and progress items
                super.subscribeToObservable(this.getAddProgressTypeObservable(dialog.componentInstance.createdProgressItemType));
            }
        });
    }

    private openEditProgressItemDialog(progressItem: ProgressItem): void {
        const dialog = this.dependencies.tdServices.dialogService.open(EditProgressItemDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
            data: progressItem
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.itemWasDeleted || dialog.componentInstance.itemWasUpdated) {
                this.reloadDataList();
            }
        });
    }

    public openSelectTypeDialog(): void {
        const dialog = this.dependencies.tdServices.dialogService.open(SelectProgressTypeDialogComponent, {
            panelClass: AppConfig.DefaultDialogPanelClass,
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.openAddCustomProgressTypeDialog) {
                this.openAddNewProgressItemTypeDialog();
            } else if (dialog.componentInstance.selectedItem) {
                // item was selected, add it
                super.subscribeToObservable(this.getAddProgressTypeObservable(dialog.componentInstance.selectedItem));
            }
        });
    }

    private getAddProgressTypeObservable(progressItemType: ProgressItemType): Observable<any> {
        return this.dependencies.itemServices.progressItemTypeService.create(progressItemType)
            .withOption('ClientId', this.client.id)
            .set()
            .takeUntil(this.ngUnsubscribe)
            .map(createResponse => {
                // add created type to local list
                this.progressItemTypes.push(createResponse.item);

                // refresh data table
                this.reloadDataList();

                // refresh form
                this.reloadForm();
            });
    }

    private getDeleteProgressTypeObservable(progressItemType: ProgressItemType): Observable<any> {
        return this.dependencies.itemServices.progressItemTypeService.delete(progressItemType.id)
            .set()
            .takeUntil(this.ngUnsubscribe)
            .map(respose => {
                // remove type from local list
                this.progressItemTypes = _.reject(this.progressItemTypes, function (item) { return item.id === respose.deletedItemId; });

                // refresh form observables
                this.reloadForm();

                // refresh data table
                this.reloadDataList();
            });
    }

    private reloadDataList(): void {
        this.progressItemsDataTable.reloadData();
    }

    private reloadForm(): void {
        if (this.progressItemForm == null) {
            // form was not yet initialized, no need to reload it.
            // reloading it would throw an error because the component is not yet there

        } else {
            this.progressItemForm.reloadForm();
        }
    }
}
