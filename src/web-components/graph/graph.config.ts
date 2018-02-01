import { Observable } from 'rxjs/Rx';

import { GraphTypeEnum } from './graph-type.enum';
import { BaseGraph } from './graph-types';
import { MultiSeries, SingleSeries } from './graph-models';
import { WebColorEnum } from '../shared/enums/web-color.enum';

export class GraphConfig<TGraph extends BaseGraph> {

    /**
     * Indicates if graph is wrapped in card
     */
    public wrapInCard: boolean = false;

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
    public width: string = '100%';

    /**
     * Height of the graph
     */
    public height: string = '400px';

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
        domain: [WebColorEnum.Red, WebColorEnum.Blue, WebColorEnum.Purple, WebColorEnum.Cyan, WebColorEnum.Yellow, WebColorEnum.Orange, WebColorEnum.Green]
    };

    /**
     * Can be used to manipulate/translate data in graph (e.g. for dates localization)
     */
    public dataResolver?: (data: MultiSeries[] | SingleSeries[]) => Observable<MultiSeries[] | SingleSeries[]>;

    constructor(
        /**
         * Graph to use
         */
        public graph: Observable<TGraph>,
        /**
         * Corresponding graph type
         */
        public graphType: GraphTypeEnum,
        options?: {
            width?: string,
            height?: string
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
