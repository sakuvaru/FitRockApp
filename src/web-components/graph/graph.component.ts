// common
import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../base-web-component.class';

// required
import { TranslateService } from '@ngx-translate/core';
import { MultiSeries, SingleSeries } from './graph-models';
import { BaseGraph } from './graph-types';
import { GraphConfig } from './graph.config';
import { GraphTypeEnum } from './graph-type.enum';

@Component({
    selector: 'graph',
    templateUrl: 'graph.component.html'
})
export class GraphComponent extends BaseWebComponent implements OnInit, OnChanges {
    @Input() config: GraphConfig<BaseGraph>;

    // use alias to graph for convenience
    private graph: BaseGraph;
    private translatedLegendTitle: string;

    private wrapperStyle: any;

    constructor(
        protected translateService: TranslateService
    ) { super() }


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

    private initGraph(config: GraphConfig<BaseGraph>): void {
        this.config = config;
        this.graph = this.config.graph;

        this.initWrapperStyle();
        this.initTranslations();
    }

    private initWrapperStyle(): void {
        var style: any = {};
        style.width = this.graph.width;
        style.height = this.graph.height;
        this.wrapperStyle = style;
    }

    private initTranslations(): void{
        // set translated title
        this.translateService.get(this.graph.legentTitleKey).subscribe(translation => this.translatedLegendTitle = translation);
    }

    onSelect(event) {
        console.log(event);
    }

}


