// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ClientsBaseComponent } from '../clients-base.component';
import { ClientMenuItems } from '../menu.items';
import { GraphConfig, MultiSeries, BaseGraph, SingleSeries, LineChart, VerticalBarChart } from '../../../../web-components/graph';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'stats-main.component.html'
})
export class StatsMainComponent extends ClientsBaseComponent implements OnInit {

    private graphConfig: GraphConfig<LineChart>;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        protected activatedRoute: ActivatedRoute) {
        super(componentDependencyService, activatedRoute)
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservables(this.getComponentObservables());
        super.initClientSubscriptions();
    }

    private getComponentObservables(): Observable<any>[] {
        var observables: Observable<any>[] = [];
        observables.push(this.getClientMenuObservable());
        observables.push(this.getStatsObservable(9));

        return observables;
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
                    }
                });
            });
    }

    private getStatsObservable(progressTypeId: number): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => {
                return this.dependencies.itemServices.progressItemService.getMultiSeriesStats(clientId, progressTypeId)
                    .set()
                    .map(response => {
                        var items = response.data.items;
                        if (items) {

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
                        }
                    })
            });
    }
}

