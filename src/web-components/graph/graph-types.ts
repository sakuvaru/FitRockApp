import { MultiSeries, SingleSeries } from './graph-models';
import { GraphTypeEnum } from './graph-type.enum';
import { Observable } from 'rxjs/Rx';

export abstract class BaseGraph {

    abstract data: Observable<MultiSeries[] | SingleSeries[]>;
    abstract type: GraphTypeEnum;

    /**
     * Leave undefined so that size of graph matches the parent
     * Size of parent wrapper is defined below
     */
    public view: any[] | undefined = undefined; 

    public width: any = '100%';
    public height: any = '400px';

    public legend: boolean = true;
    public legentTitleKey: string = 'webComponents.graph.legend';

    public scheme = {
        domain: ['#f44336', '#A10A28', '#C7B42C', '#AAAAAA']
    };
}

export class LineChart extends BaseGraph {

    public readonly type: GraphTypeEnum = GraphTypeEnum.LineChart;

    // required
    public data: Observable<MultiSeries[]>;
    public xAxisLabel: string;
    public yAxisLabel: string;

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    showYAxisLabel = true;
    autoScale = true;

    constructor(
        options: {
            data: Observable<MultiSeries[]>,
            xAxisLabel?: string,
            yAxisLabel?: string
        }
    ) {
        super()
        Object.assign(this, options)
    }
}

export class VerticalBarChart extends BaseGraph {

    public readonly type: GraphTypeEnum = GraphTypeEnum.VerticalBarChart;

    // required
    public data: Observable<SingleSeries[]>;
    public xAxisLabel: string;
    public yAxisLabel: string;

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    showYAxisLabel = true;
    autoScale = true;

    constructor(
        options: {
            data: Observable<SingleSeries[]>,
            xAxisLabel?: string,
            yAxisLabel?: string
        }

    ) {
        super()
        Object.assign(this, options)
    }
}