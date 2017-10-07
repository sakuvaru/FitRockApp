// common
import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';

// required
import { MultiSeries, SingleSeries } from '../graph-models';
import { TranslateService } from '@ngx-translate/core';
import { LineChart } from '../graph-types';
import { GraphConfig } from '../graph.config';
import { Observable } from 'rxjs/Rx';
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
    private xAxisLabel: string;

    /**
     * Y axis label
     */
    private yAxisLabel: string;

    constructor(
        protected translateService: TranslateService
    ) { super(translateService) }


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
        var obs: Observable<any> = Observable.of(true);

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


