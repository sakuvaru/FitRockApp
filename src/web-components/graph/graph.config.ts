import { BaseGraph } from './graph-types';

export class GraphConfig<TGraph extends BaseGraph>{
    constructor(
        public graph: TGraph
    ) {
    }
}