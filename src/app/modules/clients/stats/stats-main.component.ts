// common
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ProgressItemType } from '../../../models';
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { GraphConfig, MultiSeries, BaseGraph, SingleSeries, LineChart, VerticalBarChart, GraphComponent } from '../../../../web-components/graph';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'stats-main.component.html'
})
export class StatsMainComponent extends ClientsBaseComponent implements OnInit {

    private graphConfig: GraphConfig<LineChart>;
    private progressItemTypes: ProgressItemType[];
    private idOfActiveType: number;

    @ViewChild(GraphComponent) graph: GraphComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables(), { setComponentAsInitialized: false });
        super.initClientSubscriptions();
    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];
        observables.push(this.getClientMenuObservable());
        observables.push(this.getProgressTypesAndInitGraphObservable());

        return observables;
    }

    private getProgressTypesAndInitGraphObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.dependencies.itemServices.progressItemTypeService.items()
                    .byCurrentUser()
                    .whereEquals('ClientId', clientId)
                    .get()
                    .flatMap((response) => {
                        this.progressItemTypes = response.items;

                        // starting type -> first one in the list
                        if (this.progressItemTypes.length > 0) {
                            this.idOfActiveType = this.progressItemTypes[0].id;
                            return this.getStatsObservable(clientId, this.idOfActiveType);
                        }
                        return Observable.empty;
                    })
            });
    }

    private getClientMenuObservable(): Observable<any> {
        return this.clientChange
            .takeUntil(this.ngUnsubscribe)
            .map(client => {
                this.setConfig({
                    menuItems: new ClientMenuItems(client.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': client.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.stats'
                    },
                    menuAvatarUrl: client.avatarUrl
                });
            });
    }

    private getLoadStatsObservable(progressTypeId: number): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.getStatsObservable(clientId, progressTypeId);
            });
    }

    private getStatsObservable(clientId: number, progressTypeId: number): Observable<any> {
        return this.dependencies.itemServices.progressItemService.getMultiSeriesStats(clientId, progressTypeId)
            .set()
            .map(response => {
                var items = response.data.items;
                if (items) {
                    this.idOfActiveType = progressTypeId;

                    this.graphConfig = new GraphConfig(new LineChart({
                        results: items,
                    }));

                    // resolve x/y label translations
                    super.translate(response.data.xAxisLabel).subscribe(translation => {
                        this.graphConfig.graph.xAxisLabel = translation;
                    });
                    super.translate(response.data.yAxisLabel).subscribe(translation => {
                        this.graphConfig.graph.yAxisLabel = translation;
                    });

                    this.graph.forceReinitialization(this.graphConfig);

                    // set component as initialized once graph is ready
                    super.setComponentAsInitialized(true);
                }
            })
    }

    private onSelectType(progressItemType: ProgressItemType): void {
        super.subscribeToObservable(this.getStatsObservable(this.clientId, progressItemType.id));
    }
}

