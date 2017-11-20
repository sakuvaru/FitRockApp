// common
import { Component, Input, Output, OnInit, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ProgressItemType } from '../../../../models';
import { GraphConfig, MultiSeries, BaseGraph, SingleSeries, LineChart, VerticalBarChart, GraphComponent } from '../../../../../web-components/graph';
import { Observable } from 'rxjs/Rx';

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

    setup(): ComponentSetup | null {
        return null;
    }

    ngOnInit() {
        super.ngOnInit();

        this.initStats();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initStats();
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
                        xAxisLabel: super.translate(response.data.xAxisLabel),
                        yAxisLabel: super.translate(response.data.yAxisLabel)
                    });
                })
        )
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

    private onSelectType(progressItemType: ProgressItemType): void {
        const newGraphConfig = this.getGraphConfig(this.userId, progressItemType.id);
        // reload graph
        this.graph.forceReinitialization(newGraphConfig);
    }
}

