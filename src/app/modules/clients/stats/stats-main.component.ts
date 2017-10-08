// common
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

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

    private graphConfig: GraphConfig<BaseGraph>;
    private progressItemTypes: ProgressItemType[];
    private idOfActiveType: number;

    @ViewChild(GraphComponent) graph: GraphComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    private getComponentObservables(): Observable<any>[] {
        const observables: Observable<any>[] = [];
        observables.push(this.getClientMenuObservable());
        observables.push(this.getProgressTypesAndInitGraphObservable());

        return observables;
    }

    private getGraphConfig(clientId: number, progressItemId: number): GraphConfig<BaseGraph> {
        return this.dependencies.webComponentServices.graphService.lineChart(
            this.dependencies.itemServices.progressItemService.getMultiSeriesStats(clientId, progressItemId)
                .set()
                .map(response => {
                    this.idOfActiveType = progressItemId;
                    return new LineChart(response.data.items, {
                        xAxisLabel: super.translate(response.data.xAxisLabel),
                        yAxisLabel: super.translate(response.data.yAxisLabel)
                    });
                })
        )
            .build();
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
                    menuAvatarUrl: client.avatarUrl,
                });
            });
    }

    private getProgressTypesAndInitGraphObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.dependencies.itemServices.progressItemTypeService.items()
                    .byCurrentUser()
                    .whereEquals('ClientId', clientId)
                    .get();
            })
            .map(response => {
                this.progressItemTypes = response.items;

                if (this.progressItemTypes.length > 0) {
                    this.graphConfig = this.getGraphConfig(this.clientId, this.progressItemTypes[0].id);
                }
            });
    }

    private onSelectType(progressItemType: ProgressItemType): void {
        const newGraphConfig = this.getGraphConfig(this.clientId, progressItemType.id);
        // reload graph
        this.graph.forceReinitialization(newGraphConfig);
    }
}

