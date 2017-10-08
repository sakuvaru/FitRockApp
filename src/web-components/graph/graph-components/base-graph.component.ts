// common
import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { BaseWebComponent } from '../../base-web-component.class';

// required
import { TranslateService } from '@ngx-translate/core';
import { MultiSeries, SingleSeries } from '../graph-models';
import { BaseGraph } from '../graph-types';
import { GraphConfig } from '../graph.config';
import { GraphTypeEnum } from '../graph-type.enum';
import { Observable } from 'rxjs/Rx';

@Component({
})
export abstract class BaseGraphComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * This will contain graph data
     */
    protected graphData: SingleSeries[] | MultiSeries[];

    /**
     * Graph
     */
    protected graph: BaseGraph;

    /**
     *  Legend title
     */
    protected legendTitle: string;

    /**
     * Wrapper styles
     */
    protected wrapperStyle: any;

    /**
     * Indicates if component is initialized
     */
    protected initialized = false;

    /**
     * Indicates if local loader should be shown
     */
    protected showLocalLoader = false;

    /**
     * Graph configuration
     */
    @Input() abstract config: GraphConfig<BaseGraph>;

    /**
     * Initialization required for each specific graph
     */
    abstract specializedGraphInit(graph: BaseGraph): Observable<BaseGraph>;

    constructor(
        protected translateService: TranslateService
    ) { super(); }


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

    /**
     * Reinitializes graph
     * @param config Graph config
     */
    forceReinitialization(config: GraphConfig<BaseGraph>): void {
        this.initialized = false;
        this.initGraph(config);
    }

    /**
     * Reloads graph data
     */
    reloadData(): void {
        this.initialized = false;
        this.initGraph(this.config);
    }

    protected initGraph(config: GraphConfig<BaseGraph>): void {
        if (this.initialized) {
            return;
        }

        // set properties
        this.config = config;

        // loader
        if (this.config.enableLocalLoader) {
            this.showLocalLoader = true;
        }

        // init wrapper styles
        this.initWrapperStyle(config);

        // translate legend
        this.getInitTranslationsObservable(config)
            .takeUntil(this.ngUnsubscribe)
            .subscribe();

        // init graph
        this.config.graph
            .switchMap(graph => {

                // assign graph
                this.graph = graph;

                // assign graph data
                this.graphData = graph.data;

                return this.specializedGraphInit(graph);
            })
            .map(graph => {
                // loader
                if (this.config.enableLocalLoader) {
                    this.showLocalLoader = false;
                }

                // set graph as initialized
                this.initialized = true;
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private initWrapperStyle(config: GraphConfig<BaseGraph>): void {
        const style: any = {};
        style.width = config.width;
        style.height = config.height;
        this.wrapperStyle = style;
    }

    private getInitTranslationsObservable(config: GraphConfig<BaseGraph>): Observable<void> {
        return this.translateService.get(config.legendTitleKey).map(translation => {
            this.legendTitle = translation;
        });
    }

    onSelect(event) {
        console.log(event);
    }

}


