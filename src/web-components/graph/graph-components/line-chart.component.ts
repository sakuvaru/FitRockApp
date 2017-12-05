import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { LocalizationService } from '../../../lib/localization';
import { LineChart } from '../graph-types';
import { GraphConfig } from '../graph.config';
import { BaseGraphComponent } from './base-graph.component';

@Component({
    selector: 'line-chart',
    templateUrl: 'line-chart.component.html'
})
export class LineChartGraphComponent extends BaseGraphComponent implements OnInit, OnChanges {

    /**
     * Graph configuration
     */
    @Input() config: GraphConfig<LineChart>;

    /**
     * X axis label
     */
    public xAxisLabel: string;

    /**
     * Y axis label
     */
    public yAxisLabel: string;

    constructor(
        protected localizationService: LocalizationService
    ) { super(localizationService); }


    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    specializedGraphInit(graph: LineChart): Observable<LineChart> {
        return this.getLabelsObservable(graph);
    }

    private getLabelsObservable(graph: LineChart): Observable<LineChart> {
        let obs: Observable<any> = Observable.of(true);

        if (graph.xAxisLabel) {
            obs = graph.xAxisLabel
                .map(label => {
                    this.xAxisLabel = label;
                });
        }

        if (graph.yAxisLabel) {
            obs = obs.merge(graph.yAxisLabel
                .map(label => this.yAxisLabel = label));
        }

        return obs.map(() => graph);
    }
}


