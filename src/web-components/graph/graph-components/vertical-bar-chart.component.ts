// common
import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';

// required
import { TranslateService } from '@ngx-translate/core';
import { VerticalBarChart } from '../graph-types';
import { GraphConfig } from '../graph.config';
import { Observable } from 'rxjs/Rx';

import { BaseGraphComponent } from './base-graph.component';

@Component({
    selector: 'vertical-bar-chart',
    templateUrl: 'vertical-bar-chart.component.html'
})
export class VerticalBarGraphComponent extends BaseGraphComponent implements OnInit, OnChanges {

    /**
     * Graph configuration
     */
    @Input() config: GraphConfig<VerticalBarChart>;

    /**
     * X axis label
     */
    public xAxisLabel: string;

    /**
     * Y axis label
     */
    public yAxisLabel: string;

    constructor(
        protected translateService: TranslateService
    ) { super(translateService); }


    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    specializedGraphInit(graph: VerticalBarChart): Observable<VerticalBarChart> {
        return this.getLabelsObservable(graph);
    }

    private getLabelsObservable(graph: VerticalBarChart): Observable<VerticalBarChart> {
        const obs: Observable<any> = Observable.of(true);

        if (graph.xAxisLabel) {
            obs.merge(graph.xAxisLabel
                .map(label => this.xAxisLabel = label));
        }

        if (graph.yAxisLabel) {
            obs.merge(graph.yAxisLabel
                .map(label => this.yAxisLabel = label));
        }

        return obs.map(() => graph);
    }
}


