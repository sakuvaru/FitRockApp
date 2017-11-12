// common
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';

// required by component
import { ProgressItemType } from '../../../../models';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { FormConfig, DynamicFormComponent } from '../../../../../web-components/dynamic-form';
import { DataListConfig, AlignEnum, Filter, DataListComponent, DataListField } from '../../../../../web-components/data-list';
import { ProgressItem, User, ProgressItemTypeWithCountDto } from '../../../../models';
import { Observable } from 'rxjs/Rx';
import { EditProgressItemDialogComponent } from '../dialogs/edit-progress-item-dialog.component';
import { SelectProgressTypeDialogComponent } from '../dialogs/select-progress-type-dialog.component';
import { NewClientProgressItemTypeDialogComponent } from '../dialogs/new-client-progress-item-type-dialog.component';
import * as _ from 'underscore';
import { stringHelper } from '../../../../../lib/utilities';

@Component({
    templateUrl: 'edit-client-progress.component.html'
})
export class EditClientProgressComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<ProgressItem>;
    private DataListConfig: DataListConfig<ProgressItem>;
    private progressItemTypes: ProgressItemType[];

    @ViewChild(DataListComponent) progressItemsDataList: DataListComponent;
    @ViewChild(DynamicFormComponent) progressItemForm: DynamicFormComponent;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    private getComponentObservables(): Observable<any>[] {
        const observables: Observable<any>[] = [];

        const obsClientMenu = this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .map(client => {
                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.progress'
                    },
                    menuAvatarUrl: client.avatarUrl
                });
            });

        observables.push(this.getInitFormObservable());
        observables.push(this.getDataListObservable());
        observables.push(obsClientMenu);
        observables.push(this.getProgressTypesObservable());

        return observables;
    }

    private getInitFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                this.initProgressItemsForm(clientId);
            });
    }

    private initProgressItemsForm(clientId: number): void {
        this.formConfig = this.dependencies.itemServices.progressItemService.insertForm({
            customFormDefinitionQuery: this.dependencies.itemServices.progressItemService.insertFormQuery().withData('clientId', clientId)
        })
            .wrapInCard(false)
            .fieldValueResolver((fieldName, value) => {
                if (fieldName === 'ClientId') {
                    return this.clientId;
                }
                return value;
            })
            .onAfterSave(() => {
                this.reloadDataList();
            })
            .clearFormAfterSave(true)
            .onFieldValueChange((config, changedField, newValue) => {
                // set extra translation value for measurement value based on currently selected type
                // process for changing the measurement type
                if (changedField.key !== 'ProgressItemTypeId') {
                    return;
                }

                // get option with the value === newValue 
                if (!changedField.options || !changedField.options.listOptions) {
                    return;
                }

                const listOption = changedField.options.listOptions.find(m => m.value === newValue);
                const measurementValueField = config.fields.find(m => m.key === 'Value');

                if (!measurementValueField) {
                    return;
                }

                if (!listOption) {
                    // option is not in the list, use the default label
                    super.translate('form.progressItem.value')
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe(translation => {
                            measurementValueField.label = translation;
                        });
                } else {
                    // set new custom translation label
                    const translationData: any = {};
                    const unitCode = listOption.extraDataJson.unit;
                    super.translate('module.progressItemUnits.' + unitCode)
                        .flatMap(unitTranslation => {
                            translationData.unit = unitTranslation;
                            return super.translate('form.progressItem.valueWithUnit', translationData)
                                .map(translation => {
                                    measurementValueField.label = stringHelper.capitalizeText(translation);
                                });
                        })
                        .takeUntil(this.ngUnsubscribe)
                        .subscribe();
                }
            })
            .build();
    }

    private getProgressTypesObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.dependencies.itemServices.progressItemTypeService.items()
                    .byCurrentUser()
                    .whereEquals('ClientId', clientId)
                    .get()
                    .takeUntil(this.ngUnsubscribe);
            })
            .map((response) => {
                this.progressItemTypes = response.items;
            });
    }

    private initDataList(clientId: number): void {
        this.DataListConfig = this.dependencies.webComponentServices.dataListService.dataList<ProgressItem>(
            searchTerm => {
                return this.dependencies.itemServices.progressItemService.items()
                    .includeMultiple(['ProgressItemType', 'ProgressItemType.ProgressItemUnit'])
                    .whereEquals('ClientId', clientId)
                    .orderByDescending('MeasurementDate');
            }
        )
            .withFields([
                {
                    value: (item: ProgressItem) =>
                        item.progressItemType.translateValue
                            ? super.translate('module.progressItemTypes.globalTypes.' + item.progressItemType.codename)
                            : item.progressItemType.typeName
                    ,
                    isSubtle: false,
                    hideOnSmallScreens: false,
                    align: AlignEnum.Left,
                },
                {
                    value: (item: ProgressItem) => item.value.toString(),
                    isSubtle: true,
                    hideOnSmallScreens: false,
                    align: AlignEnum.Left,
                },
                {
                    value: (item: ProgressItem) => super.translate('module.progressItemUnits.' + item.progressItemType.progressItemUnit.unitCode),
                    isSubtle: true,
                    hideOnSmallScreens: true,
                    align: AlignEnum.Left
                },
                {
                    value: (item) => super.moment(item.measurementDate).format('MMMM DD'),
                    isSubtle: true,
                    hideOnSmallScreens: false,
                    align: AlignEnum.Right,
                },
            ])
            .dynamicFilters((searchTerm) => {
                return this.dependencies.itemServices.progressItemTypeService.getProgressItemTypeWithCountDto(this.clientId, undefined)
                    .get()
                    .map(response => {
                        const filters: Filter<ProgressItemTypeWithCountDto>[] = [];
                        response.items.forEach(type => {
                            let typeKey;
                            if (type.translateValue) {
                                typeKey = 'module.progressItemTypes.globalTypes.' + type.codename;
                            } else {
                                typeKey = type.typeName;
                            }

                            filters.push(new Filter({
                                filterNameKey: typeKey,
                                onFilter: (query) => query.whereEquals('ProgressItemTypeId', type.id),
                                count: type.progressItemsCount
                            }));
                        });
                        return filters;
                    })
                    .takeUntil(this.ngUnsubscribe);
            })
            .wrapInCard(true)
            .showAllFilter(true)
            .showSearch(false)
            .onClick((item) => this.openEditProgressItemDialog(item))
            .build();
    }

    private getDataListObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                this.initDataList(clientId);
            });
    }

    private handleDeleteType(progressItemType: ProgressItemType): void {
        super.subscribeToObservable(this.getDeleteProgressTypeObservable(progressItemType));
    }

    private openAddNewProgressItemTypeDialog(): void {
        const dialog = this.dependencies.tdServices.dialogService.open(NewClientProgressItemTypeDialogComponent, {
            width: AppConfig.DefaultDialogWidth,
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
            width: AppConfig.DefaultDialogWidth,
            data: progressItem
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.itemWasDeleted || dialog.componentInstance.itemWasUpdated) {
                this.reloadDataList();
            }
        });
    }

    private openSelectTypeDialog(): void {
        const dialog = this.dependencies.tdServices.dialogService.open(SelectProgressTypeDialogComponent, {
            width: AppConfig.DefaultDialogWidth,
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
            .withOption('ClientId', this.clientId)
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
        this.progressItemsDataList.forceReinitialization(this.DataListConfig);
    }

    private reloadForm(): void {
        if (this.progressItemForm == null) {
            // form was not yet initialized, no need to reload it.
            // reloading it would throw an error because the component is not yet there

        } else {
            this.progressItemForm.forceReinitialization(this.formConfig);
        }
    }
}
