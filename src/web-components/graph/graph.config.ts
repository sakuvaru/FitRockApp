import { BaseGraph } from './graph-types';
import { Observable } from 'rxjs/Rx';
import { GraphTypeEnum } from './graph-type.enum';

export class GraphConfig<TGraph extends BaseGraph>{

    /**
     * Graph
     */
    public graph: Observable<TGraph>;

    /**
     * Graph type
     */
    public graphType: GraphTypeEnum;

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
        config: {
            // required
            graph: Observable<TGraph>,
            graphType: GraphTypeEnum,

            // optional
            enableLocalLoader?: boolean,
            width?: any,
            height?: any,
            showLegend?: boolean,
            legendTitleKey?: string,
            scheme?: any
        }
    ) {
        Object.assign(this, config);
    }
}
