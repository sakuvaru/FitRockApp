import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { LocalizationService } from '../../../lib/localization';
import { VerticalBarChart } from '../graph-types';
import { GraphConfig } from '../graph.config';
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
        protected localizationService: LocalizationService
    ) { super(localizationService); }


    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    specializedGraphInit(graph: VerticalBarChart): Observable<VerticalBarChart> {
        return Observable.of(graph);
    }
}


