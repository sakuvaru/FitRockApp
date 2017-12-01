// common
import { Component, Input, ViewChild } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// required
import { LocalizationService } from '../../lib/localization';
import { BaseGraph } from './graph-types';
import { GraphConfig } from './graph.config';
import { BaseGraphComponent } from './graph-components/base-graph.component';

// graphs
import { LineChartGraphComponent } from './graph-components/line-chart.component';
import { VerticalBarGraphComponent } from './graph-components/vertical-bar-chart.component';

@Component({
    selector: 'graph',
    templateUrl: 'graph.component.html'
})
export class GraphComponent extends BaseWebComponent {

    /**
     * Graph configuration
     */
    @Input() public config: GraphConfig<BaseGraph>;

    /**
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = true;

    @ViewChild('graphComponent') graphComponent: BaseGraphComponent;

    constructor(
        protected localizationService: LocalizationService
    ) { super(); }

    /**
     * Reinitializes graph
     * @param config Graph config
     */
    forceReinitialization(config: GraphConfig<BaseGraph>): void {
        if (this.graphComponent) {
            this.graphComponent.forceReinitialization(config);
        }
    }

    /**
     * Reloads graph data
     */
    reloadData(): void {
        if (this.graphComponent) {
            this.graphComponent.reloadData();
        }
    }

    private onLoaderChanged(enabled: boolean): void {
        this.loaderEnabled = enabled;
    }

}


