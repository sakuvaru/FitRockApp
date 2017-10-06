import { BaseGraph } from './graph-types';

export class GraphConfig<TGraph extends BaseGraph>{

    /**
     * Graph
     */
    public graph: TGraph;

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader: boolean = true;

    constructor(
        config: {
            // required
            graph: TGraph,

            // optional
            enableLocalLoader?: boolean;
        }
    ) {
        Object.assign(this, config);
    }
}