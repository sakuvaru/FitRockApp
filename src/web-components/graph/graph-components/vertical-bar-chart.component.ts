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
        return this.getLabelsObservable(graph);
    }

    private getLabelsObservable(graph: VerticalBarChart): Observable<VerticalBarChart> {
        const observables: Observable<void>[] = [];

        if (graph.xAxisLabel) {
            observables.push(graph.xAxisLabel
                .map(label => {
                    this.xAxisLabel = label;
                }));
        }

        if (graph.yAxisLabel) {
            observables.push(graph.yAxisLabel
                .map(label => {
                    this.yAxisLabel = label;
                }));
        }

        if (observables.length === 0) {
            return Observable.of(graph);
        }

        const obs = observableHelper.zipObservables(observables);

        return obs.map(() => graph);
    }
}


