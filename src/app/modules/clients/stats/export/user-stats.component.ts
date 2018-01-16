import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BaseGraph, GraphComponent, GraphConfig, LineChart, MultiSeries } from '../../../../../web-components/graph';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../../core';
import { ProgressItemType } from '../../../../models';
import { stringHelper } from 'lib/utilities';

@Component({
    selector: 'user-stats',
    templateUrl: 'user-stats.component.html'
})
export class UserStatsComponent extends BaseComponent implements OnInit, OnChanges {

    @Input() userId: number;

    public graphConfig: GraphConfig<BaseGraph>;
    public progressItemTypes: ProgressItemType[];
    public idOfActiveType: number;

    @ViewChild(GraphComponent) graph: GraphComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: true
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.initStats();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initStats();
    }

    onSelectType(progressItemType: ProgressItemType): void {
        const newGraphConfig = this.getGraphConfig(this.userId, progressItemType.id);
        // reload graph
        this.graph.forceReinitialization(newGraphConfig);
    }

    private initStats(): void {
        if (!this.userId) {
            return;
        }

        this.getProgressTypesAndInitGraphObservable(this.userId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private getGraphConfig(clientId: number, progressItemId: number): GraphConfig<BaseGraph> {
        return this.dependencies.webComponentServices.graphService.lineChart(
            this.dependencies.itemServices.progressItemService.getMultiSeriesStats(clientId, progressItemId)
                .set()
                .map(response => {
                    this.idOfActiveType = progressItemId;
                    return new LineChart(response.data.items, {
                        xAxisLabel: super.translate(response.data.xAxisLabel).map(text => stringHelper.capitalizeText(text)),
                        yAxisLabel: super.translate(response.data.yAxisLabel).map(text => stringHelper.capitalizeText(text))
                    });
                })
        )
            .dataResolver(data => {
                data = data as MultiSeries[];

                data.forEach(series => {
                    series.series.forEach(singleSeries => {
                        const seriesDate = new Date(singleSeries.name);
                        singleSeries.name = super.formatDate(seriesDate);
                    });
                });

                return Observable.of(data);
            })
            .build();
    }

    private getProgressTypesAndInitGraphObservable(userId: number): Observable<any> {
        return this.dependencies.itemServices.progressItemTypeService.items()
            .byCurrentUser()
            .whereEquals('ClientId', userId)
            .get()
            .map(response => {
                this.progressItemTypes = response.items;

                if (this.progressItemTypes.length > 0) {
                    this.graphConfig = this.getGraphConfig(userId, this.progressItemTypes[0].id);
                }
            });
    }
}

