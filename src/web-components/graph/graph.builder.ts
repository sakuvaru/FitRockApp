import { MultiSeries, SingleSeries } from './graph-models';
import { GraphConfig } from './graph.config';
import { BaseGraph } from './graph-types';

export class GraphBuilder<TGraph extends BaseGraph> {

    private config: GraphConfig<TGraph>;

    constructor(
        public graph: TGraph
    ) {
        this.config = new GraphConfig<TGraph>({
            graph
        });
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
     * Gets the Graph config
     */
    build(): GraphConfig<TGraph> {
        return this.config;
    }
}