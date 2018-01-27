import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { observableHelper } from 'lib/utilities';
import { Observable } from 'rxjs/Rx';

import { LocalizationService } from '../../../lib/localization';
import { LinearGaugeChart } from '../graph-types';
import { GraphConfig } from '../graph.config';
import { BaseGraphComponent } from './base-graph.component';
import { WebColorEnum } from '../../shared/enums/web-color.enum';

@Component({
    selector: 'linear-gauge-chart',
    templateUrl: 'linear-gauge-chart.component.html'
})
export class LinearGaugeChartComponent extends BaseGraphComponent<LinearGaugeChart> implements OnInit, OnChanges {

    /**
     * Graph configuration
     */
    @Input() config: GraphConfig<LinearGaugeChart>;

    public customColorScheme?: any;

    constructor(
        protected localizationService: LocalizationService
    ) { super(localizationService); }


    ngOnInit() {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    specializedGraphInit(graph: LinearGaugeChart): Observable<LinearGaugeChart> {
        if (graph.color) {
            this.customColorScheme = this.getColor(graph.color);
        }

        return Observable.of(graph);
    }

    private getColor(color: WebColorEnum): any {
        return {
            domain: [color]
        };
    }
}


