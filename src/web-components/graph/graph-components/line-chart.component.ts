import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { LocalizationService } from '../../../lib/localization';
import { LineChart } from '../graph-types';
import { GraphConfig } from '../graph.config';
import { BaseGraphComponent } from './base-graph.component';
import { observableHelper } from 'lib/utilities';

@Component({
    selector: 'line-chart',
    templateUrl: 'line-chart.component.html'
})
export class LineChartGraphComponent extends BaseGraphComponent<LineChart> implements OnInit, OnChanges {

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
        return Observable.of(graph);
    }
}


