import { EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { LocalizationService } from '../../../lib/localization';
import { BaseWebComponent } from '../../base-web-component.class';
import { MultiSeries, SingleSeries } from '../graph-models';
import { BaseGraph } from '../graph-types';
import { GraphConfig } from '../graph.config';

export abstract class BaseGraphComponent<TGraph extends BaseGraph> extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Graph configuration
     */
    @Input() abstract config: GraphConfig<TGraph>;

    /**
     * Loader change 
     */
    @Output() loaderChanged = new EventEmitter<boolean>();

    /**
     * Subject for loading graph
     */
    private loadGraph$ = new Subject<void>();

    /**
     * This will contain graph data
     */
    public graphData: SingleSeries[] | MultiSeries[];

    /**
     * Graph
     */
    public graph: TGraph;

    /**
     *  Legend title
     */
    public legendTitle: string;

    /**
     * Wrapper styles
     */
    public wrapperStyle: any;

    /**
     * Indicates if component is initialized
     */
    public initialized = false;

    /**
     * Initialization required for each specific graph
     */
    abstract specializedGraphInit(graph: TGraph): Observable<TGraph>;

    constructor(
        protected localizationService: LocalizationService
    ) { super(); }


    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initGraph();
    }

    /**
     * Reinitializes graph
     * @param config Graph config
     */
    forceReinitialization(config: GraphConfig<TGraph>): void {
        this.config = config;

        this.initialized = false;

        // unsubscribe from load observable
        this.loadGraph$.unsubscribe();
        this.loadGraph$ = new Subject<void>();

        // init graph
        this.initGraph();
    }

    /**
     * Loads graph data
     */
    loadGraph(): void {
        this.loadGraph$.next();
    }

    protected initGraph(): void {
        if (!this.config) {
            return;
        }

        if (this.initialized) {
            // this makes graph reload if the config changes
            this.forceReinitialization(this.config);
            return;
        }

        this.initialized = true;

        // init wrapper styles
        this.initWrapperStyle(this.config);

        // translate legend
        this.getInitTranslationsObservable(this.config)
            .takeUntil(this.ngUnsubscribe)
            .subscribe();

        // subscribe to data loader
        this.subscribeToLoadGraph();

        // load graph data
        this.loadGraph();
    }

    private subscribeToLoadGraph(): void {
        this.loadGraph$
            .do(() => {
                // start loader
                if (this.config.enableLocalLoader) {
                    this.loaderChanged.next(true);
                }
            })
            .switchMap(() => this.getLoadGraphObservable())
            .takeUntil(this.ngUnsubscribe)
            .subscribe(() => {
                // stop loader
                if (this.config.enableLocalLoader) {
                    this.loaderChanged.next(false);
                }
            });
    }

    private getLoadGraphObservable(): Observable<void> {
        // init graph
        return this.config.graph
            .switchMap(graph => {
               // return Observable.of(graph);
                return this.specializedGraphInit(graph);
            })
            .switchMap(graph => {
                // assign graph
                this.graph = graph as TGraph;

                // data does not need to be resolved using custom function
                if (!this.config.dataResolver) {
                    return Observable.of(graph.data);
                }

                // use data resolver
                return this.config.dataResolver(graph.data);
            })
            .map(graphData => {
                // assign graph data
                this.graphData = graphData;
            });

    }
    private initWrapperStyle(config: GraphConfig<BaseGraph>): void {
        const style: any = {};
        style.width = config.width;
        style.height = config.height;
        this.wrapperStyle = style;
    }

    private getInitTranslationsObservable(config: GraphConfig<BaseGraph>): Observable<void> {
        return this.localizationService.get(config.legendTitleKey).map(translation => {
            this.legendTitle = translation;
        });
    }

    onSelect(event) {
        console.log(event);
    }

}


