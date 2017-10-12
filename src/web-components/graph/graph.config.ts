import { BaseGraph } from './graph-types';
import { Observable } from 'rxjs/Rx';
import { GraphTypeEnum } from './graph-type.enum';

export class GraphConfig<TGraph extends BaseGraph> {

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;

    /**
     * Leave undefined so that size of graph matches the parent
     * Size of parent wrapper is defined below
     */
    public view: any[] | undefined = undefined;

    /**
     * Width of graph
     */
    public width: any = '100%';

    /**
     * Height of the graph
     */
    public height: any = '400px';

    /**
     * Indicates if legend will be shown
     */
    public showLegend = false;

    /**
     * Legend translation key
     */
    public legendTitleKey = 'webComponents.graph.legend';

    /**
     * Graph color scheme
     */
    public scheme = {
        domain: ['#f44336', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    constructor(
        /**
         * Graph to use
         */
        public graph: Observable<TGraph>,
        /**
         * Corresponding graph type
         */
        public graphType: GraphTypeEnum,
    ) {
    }
}
