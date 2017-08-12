// common
import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// required
import { MultiSeries, SingleSeries } from './graph-models';
import { BaseGraph } from './graph-types';
import { GraphConfig } from './graph.config';
import { GraphTypeEnum } from './graph-type.enum';

@Component({
    selector: 'graph',
    templateUrl: 'graph.component.html'
})
export class GraphComponent extends BaseWebComponent implements OnInit, OnChanges {
    @Input() config: GraphConfig;

    // use alias to graph for convenience
    private graph: BaseGraph;

    constructor() {
        super()
        //Object.assign(this, { single })
    }

    ngOnInit() {
        if (this.config) {
            this.initGraph(this.config);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {
            this.initGraph(changes.config.currentValue);
        }
    }

    private initGraph(config: GraphConfig): void {
        this.config = config;
        this.graph = this.config.graph;
    }

    single: any[];
    multi: any[];
    view: any[] = [700, 400];

    onSelect(event) {
        console.log(event);
    }

}


