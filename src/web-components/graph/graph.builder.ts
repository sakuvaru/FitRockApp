import { Observable } from 'rxjs/Rx';

import { GraphTypeEnum } from './graph-type.enum';
import { BaseGraph } from './graph-types';
import { GraphConfig } from './graph.config';

export class GraphBuilder<TGraph extends BaseGraph> {

    public config: GraphConfig<TGraph>;

    constructor(
        public graph: Observable<TGraph>,
        public graphType: GraphTypeEnum
    ) {
        this.config = new GraphConfig<TGraph> (
            graph,
            graphType
        );
    }

    
    /**
     * Indicates if graph is wrapped in card
     */
    wrapInCard(wrap: boolean): this {
        this.config.wrapInCard = wrap;
        return this;
    }

    /**
     * Enables or disables local loader
     * @param enable Enable or Disable local loader
     */
    enableLocalLoader(enable: boolean): this {
        this.config.enableLocalLoader = enable;
        return this;
    }

    /**
    * Width of graph
    * E.g. '100%'
    */
    width(width: any): this {
        this.config.width = width;
        return this;
    }

    /**
     * Height of the graph
     * E.g. '400px';
     */
    height(height: any): this {
        this.config.height = height;
        return this;
    }

    /**
     * Indicates if legend will be shown
     */
    showLegend(show: boolean): this {
        this.config.showLegend = show;
        return this;
    }

    /**
     * Legend translation key
     */
    legendTitleKey(key: string): this {
        this.config.legendTitleKey = key;
        return this;
    }

    /**
     * Graph color scheme
     * Example: domain: ['#f44336', '#A10A28', '#C7B42C', '#AAAAAA']
     */
    scheme(colorScheme: any): this {
        this.config.scheme = colorScheme;
        return this;
    }

    /**
     * Gets the Graph config
     */
    build(): GraphConfig<TGraph> {
        return this.config;
    }
}
