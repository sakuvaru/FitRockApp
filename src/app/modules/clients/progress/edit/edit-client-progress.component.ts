// common
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientMenuItems } from '../../menu.items';
import { FormConfig, DynamicFormComponent } from '../../../../../web-components/dynamic-form';
import { DataTableConfig, AlignEnum, Filter } from '../../../../../web-components/data-table';
import { ProgressItem, User, ProgressItemTypeWithCountDto } from '../../../../models';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { EditProgressItemDialog } from '../dialogs/edit-progress-item-dialog.component';

@Component({
    templateUrl: 'edit-client-progress.component.html'
})
export class EditClientProgressComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<ProgressItem>;
    private dataTableConfig: DataTableConfig<ProgressItem>;
    private clientId: number;
    private client: User;

    private observables: Observable<any>[] = [];
    private observablesCompleted: number = 0;

    @ViewChild(DynamicFormComponent) formComponent: DynamicFormComponent;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.initCompoment();
    }

    private initCompoment(): void {
        super.startLoader();

        var joinedObservable = this.getJoinedObservable();

        joinedObservable
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                this.observablesCompleted++;
                if (this.observablesCompleted === this.observables.length) {
                    super.stopLoader();
                    this.observablesCompleted = 0;
                }
            },
            error => super.handleError(error)
            );
    }

    private getJoinedObservable(): Observable<any> {
        var obsClientId = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map(params => this.clientId = +params['id']);

        var obsClient = this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => this.dependencies.itemServices.userService.editForm(+params['id']))
            .map(form => {
                this.client = form.getItem();

                this.setConfig({
                    menuItems: new ClientMenuItems(this.client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': this.client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.progress'
                    }
                });
            });

        var obsForm = this.getFormObservable();
        var obsDataTable = this.getDataTableObservable();

        this.observables.push(obsClientId);
        this.observables.push(obsClient);
        this.observables.push(obsForm);
        this.observables.push(obsDataTable);

        return this.dependencies.coreServices.repositoryClient.mergeObservables(this.observables);
    }

    private getFormObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => {
                this.clientId = +params['id'];
                return this.dependencies.itemServices.progressItemService.insertForm()
            })
            .map(form => {
                // set clientId manually
                form.withFieldValue('ClientId', this.clientId);

                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => {
                    this.reloadDataTable();
                    super.stopGlobalLoader();
                });

                form.onError(() => super.stopGlobalLoader());

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
                    translationData.unit = listOption.extraDataJson.unit;
                    super.translate('form.progressItem.valueWithUnit', translationData).subscribe(translation => {
                        var field = config.fields.find(m => m.key === 'Value');
                        if (field) {
                            field.translatedLabel = translation;
                        }
                    })
                });

                // get form
                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }

    private getDataTableObservable(): Observable<any> {
        return this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params) => {
                var clientId = +params['id'];
                this.dataTableConfig = this.dependencies.webComponentServices.dataTableService.dataTable<ProgressItem>()
                    .fields([
                        {
                            value: (item) => { return item.value.toString() + ' ' + item.progressItemType.progressItemUnit.unitCode }, flex: 60
                        },
                        {
                            value: (item) => { return super.moment(item.measurementDate.toString()).format('LL') },
                            isSubtle: true,
                            hideOnSmallScreens: false,
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
                                    filters.push(new Filter({
                                        filterNameKey: type.typeName,
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
                    .onBeforeLoad(() => super.startLoader())
                    .onAfterLoad(() => super.stopLoader())
                    .onClick((item) => this.openEditProgressItemDialog(item))
                    .build();
            })
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

    private reloadDataTable(): void {
        var dataTableObs = this.getDataTableObservable();
        dataTableObs
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

}