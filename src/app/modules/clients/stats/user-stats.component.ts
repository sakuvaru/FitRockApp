import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { stringHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { BaseGraph, GraphComponent, GraphConfig, LineChart, MultiSeries } from '../../../../web-components/graph';
import { ComponentDependencyService } from '../../../core';
import { ProgressItemType } from '../../../models';
import { BaseClientModuleComponent } from '../base-client-module.component';

@Component({
    selector: 'mod-user-stats',
    templateUrl: 'user-stats.component.html'
})
export class UserStatsComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    public graphConfig?: GraphConfig<BaseGraph>;
    public progressItemTypes: ProgressItemType[] = [];
    public idOfActiveType?: number;

    @ViewChild(GraphComponent) graph: GraphComponent;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.client) {
            this.initStats();
        }
    }

    onSelectType(progressItemType: ProgressItemType): void {
        const newGraphConfig = this.getGraphConfig(this.client.id, progressItemType.id);
        // reload graph
        this.graph.forceReinitialization(newGraphConfig);
    }

    private initStats(): void {
        if (!this.client.id) {
            return;
        }

        this.getProgressTypesAndInitGraphObservable(this.client.id)
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
                const dataConst = data as MultiSeries[];
                const originalSeriesLabel: string = data[0].name;

                // translate line value
                return super.translate('module.progressItemTypes.globalTypes.' + originalSeriesLabel).map(text => {
                    dataConst.forEach(series => {
                        // if translation could not be resolved, use original name
                        series.name = text.startsWith('module.progressItemTypes.globalTypes.') ? originalSeriesLabel : text;
                        series.series.forEach(singleSeries => {
                            const seriesDate = new Date(singleSeries.name);
                            singleSeries.name = super.formatDate(seriesDate);
                        });
                    });
                    return data;
                });
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

