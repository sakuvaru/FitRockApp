import { Component, Input, ViewChild } from '@angular/core';

import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';
import { BaseGraphComponent } from './graph-components/base-graph.component';
import { BaseGraph } from './graph-types';
import { GraphConfig } from './graph.config';

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

    @ViewChild('graphComponent') graphComponent: BaseGraphComponent<any>;

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
            this.graphComponent.loadGraph();
        }
    }

    onLoaderChanged(enabled: boolean): void {
        this.loaderEnabled = enabled;
    }

}


