// common
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ProgressItemType } from '../../../../models';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { FormConfig, DynamicFormComponent } from '../../../../../web-components/dynamic-form';
import { DataTableConfig, AlignEnum, Filter } from '../../../../../web-components/data-table';
import { ProgressItem, User, ProgressItemTypeWithCountDto } from '../../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { EditProgressItemDialog } from '../dialogs/edit-progress-item-dialog.component';
import { SelectProgressTypeDialog } from '../dialogs/select-progress-type-dialog.component';
import * as _ from 'underscore';

@Component({
    templateUrl: 'edit-client-progress.component.html'
})
export class EditClientProgressComponent extends ClientsBaseComponent implements OnInit {

    private formConfig: FormConfig<ProgressItem> | undefined;
    private dataTableConfig: DataTableConfig<ProgressItem>;
    private progressItemTypes: ProgressItemType[];

    @ViewChild(DynamicFormComponent) formComponent: DynamicFormComponent;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];

        var obsClientMenu = this.clientChange
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

        observables.push(this.getInitFormObseravble());
        observables.push(this.getDataTableObservable());
        observables.push(obsClientMenu);
        observables.push(this.getProgressTypesObservable());

        return observables;
    }

    private getInitFormObseravble(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.getFormObservable(clientId);
            });
    }

    private getFormObservable(clientId: number): Observable<any> {
        return this.dependencies.itemServices.progressItemService.insertForm({
            useCustomQuery: this.dependencies.itemServices.progressItemService.insertFormQuery()
                .withData('clientId', clientId)
        })
            .map(form => {
                // set clientId manually
                form.withFieldValue('ClientId', this.clientId);

                form.loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader());
                form.onAfterSave(() => {
                    this.reloadDataTable();
                });

                // set extra translation value for measurement value based on currently selected type
                form.onFieldValueChange((config, changedField, newValue) => {
                    // get measurement value field
                    var measurementValueField = config.fields.find(m => m.key === 'Value');
                    if (!measurementValueField) {
                        return
                    }

                    // get option with the value === newValue 
                    if (!changedField.options || !changedField.options.listOptions) {
                        return;
                    }

                    var listOption = changedField.options.listOptions.find(m => m.value === newValue);
                    if (!listOption) {
                        return;
                    }

                    // set new custom translation label
                    var translationData: any = {};
                    var unitCode = listOption.extraDataJson.unit;
                    super.translate('module.progressItemUnits.' + unitCode).subscribe(unitTranslation => {
                        var translationData: any = {};
                        translationData.unit = unitTranslation;
                        super.translate('form.progressItem.valueWithUnit', translationData).subscribe(translation => {
                            var field = config.fields.find(m => m.key === 'Value');
                            if (field) {
                                field.translatedLabel = translation;
                            }
                        })
                    })

                });

                // reload form
                this.formConfig = undefined;
                this.formConfig = form.build();
                this.formConfig.item
            },
            error => super.handleError(error));
    }

    private getProgressTypesObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.dependencies.itemServices.progressItemTypeService.items()
                    .byCurrentUser()
                    .whereEquals('ClientId', clientId)
                    .get()
                    .takeUntil(this.ngUnsubscribe)
            })
            .map((response) => {
                this.progressItemTypes = response.items;
            })
    }

    private initDataTable(clientId: number): void {
        this.dataTableConfig = this.dependencies.webComponentServices.dataTableService.dataTable<ProgressItem>()
            .fields([
                {
                    value: (item) => { return item.value.toString() }, flex: 60
                },
                {
                    translateValue: true,
                    value: (item) => { return 'module.progressItemUnits.' + item.progressItemType.progressItemUnit.unitCode },
                    isSubtle: true,
                    hideOnSmallScreens: true,
                    align: AlignEnum.Right
                },
                {
                    value: (item) => { return super.moment(item.measurementDate).format('MMMM DD') },
                    isSubtle: true,
                    hideOnSmallScreens: true,
                    align: AlignEnum.Right
                },
            ])
            .loadQuery(searchTerm => {
                return this.dependencies.itemServices.progressItemService.items()
                    .includeMultiple(['ProgressItemType', 'ProgressItemType.ProgressItemUnit'])
                    .whereEquals('ClientId', clientId)
                    .orderByDescending('MeasurementDate')
            })
            .loadResolver(query => {
                return query
                    .get()
                    .takeUntil(this.ngUnsubscribe)
            })
            .dynamicFilters((searchTerm) => {
                return this.dependencies.itemServices.progressItemTypeService.getProgressItemTypeWithCountDto(this.clientId, undefined)
                    .get()
                    .map(response => {
                        var filters: Filter<ProgressItemTypeWithCountDto>[] = [];
                        response.items.forEach(type => {
                            var typeKey;
                            if (type.translateValue) {
                                typeKey = 'module.progressItemTypes.globalTypes.' + type.codename;
                            }
                            else {
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
                    .takeUntil(this.ngUnsubscribe)
            })
            .wrapInCard(true)
            .showAllFilter(true)
            .showSearch(false)
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .onClick((item) => this.openEditProgressItemDialog(item))
            .build();
    }

    private getDataTableObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                this.initDataTable(clientId)
            })
    }

    private handleDeleteType(progressItemType: ProgressItemType): void {
        super.subscribeToObservable(this.getDeleteProgressTypeObservable(progressItemType));
    }

    private openEditProgressItemDialog(progressItem: ProgressItem): void {
        var dialog = this.dependencies.tdServices.dialogService.open(EditProgressItemDialog, {
            width: AppConfig.DefaultDialogWidth,
            data: progressItem
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.itemWasDeleted || dialog.componentInstance.itemWasUpdated) {
                // reload data table
                this.reloadDataTable();
            }
        })
    }

    private openSelectTypeDialog(): void {
        var dialog = this.dependencies.tdServices.dialogService.open(SelectProgressTypeDialog, {
            width: AppConfig.DefaultDialogWidth,
        });

        dialog.afterClosed().subscribe(m => {
            if (dialog.componentInstance.selectedItem) {
                // item was selected, add it
                super.subscribeToObservable(this.getAddProgressTypeObservable(dialog.componentInstance.selectedItem));
            }
        })
    }

    private getAddProgressTypeObservable(progressItemType: ProgressItemType): Observable<any> {
        return this.dependencies.itemServices.progressItemTypeService.create(progressItemType)
            .withOption('ClientId', this.clientId)
            .set()
            .takeUntil(this.ngUnsubscribe)
            .flatMap((createResponse) => {
                // add created type to local list
                this.progressItemTypes.push(createResponse.item);

                // refresh form
                return this.getFormObservable(this.clientId);
            })
            .map(formResponse => {
                // refresh data table
                this.reloadDataTable();
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
                super.subscribeToObservable(this.getFormObservable(this.clientId));

                // refresh data table
                this.reloadDataTable();
            });
    }

    private reloadDataTable(): void {
        this.initDataTable(this.clientId);
    }

}