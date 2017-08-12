// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ClientMenuItems } from '../menu.items';
import { GraphConfig, MultiSeries, BaseGraph, SingleSeries, LineChart, VerticalBarChart } from '../../../../web-components/graph';

@Component({
    templateUrl: 'stats-main.component.html'
})
export class StatsMainComponent extends BaseComponent {

    private clientId: number;
    private graphConfig: GraphConfig<BaseGraph>;
    private graphConfig2: GraphConfig<LineChart>;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
        private activatedRoute: ActivatedRoute) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();
        this.initStats();
    }

    private initStats(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap(params => this.dependencies.itemServices.userService.item().byId(+params['id']).get())
            .map(response => {
                this.clientId = response.item.id;

                this.setConfig({
                    menuItems: new ClientMenuItems(this.clientId).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': response.item.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.submenu.stats'
                    }
                });

                /*this.graphConfig = new GraphConfig(new LineChart({
                    results: multi,
                    xAxisLabel: 'Hello',
                    yAxisLabel: 'smurfs'
                })); */

                this.dependencies.itemServices.progressItemService.getMultiSeriesStats(this.clientId, 4)
                    .set()
                    .subscribe(response => {
                        var items = response.data.items;
                        if (items) {

                            this.graphConfig2 = new GraphConfig(new LineChart({
                                results: items,
                            }));

                            // resolve x/y label translations
                            super.translate(response.data.xAxisLabel).subscribe(translation => {
                                this.graphConfig2.graph.xAxisLabel = translation;
                            });
                            super.translate(response.data.yAxisLabel).subscribe(translation => {
                                this.graphConfig2.graph.yAxisLabel = translation;
                            });
                        }

                    })


            }).subscribe();
    }
}

var single: SingleSeries[] = [
    new SingleSeries('Germany', 8940000),
    new SingleSeries('USA', 2310000),
    new SingleSeries('CZE', 110000),
]

var multi: MultiSeries[] = [
    new MultiSeries('Germany', [new SingleSeries('2010', 73), new SingleSeries('2011', 75), new SingleSeries('2012', 85)]),
    new MultiSeries('USA', [new SingleSeries('2010', 150), new SingleSeries('2011', 125), new SingleSeries('2012', 135)]),
    new MultiSeries('CZE', [new SingleSeries('2010', 4), new SingleSeries('2011', 10), new SingleSeries('2012', 60)])
]