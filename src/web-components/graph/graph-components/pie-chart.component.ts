import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { LocalizationService } from '../../../lib/localization';
import { PieChart } from '../graph-types';
import { GraphConfig } from '../graph.config';
import { BaseGraphComponent } from './base-graph.component';

@Component({
    selector: 'pie-chart',
    templateUrl: 'pie-chart.component.html'
})
export class PieChartComponent extends BaseGraphComponent<PieChart> implements OnInit, OnChanges {

    /**
     * Graph configuration
     */
    @Input() config: GraphConfig<PieChart>;

    constructor(
        protected localizationService: LocalizationService
    ) { super(localizationService); }


    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    specializedGraphInit(graph: PieChart): Observable<PieChart> {
        return Observable.of(graph);
    }
}


