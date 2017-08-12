import { MultiSeries, SingleSeries } from './graph-models';
import { GraphTypeEnum } from './graph-type.enum';

export abstract class BaseGraph {
    abstract results: MultiSeries[] | SingleSeries[];
    abstract type: GraphTypeEnum;

    public view: any[] = [700, 400];
    public legend: boolean = true;

    public scheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
}

export class LineChart extends BaseGraph {

    public readonly type: GraphTypeEnum = GraphTypeEnum.LineChart;

    // required
    public results: MultiSeries[];
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
            results: MultiSeries[],
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
    public results: SingleSeries[];
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
            results: SingleSeries[],
            xAxisLabel: string,
            yAxisLabel: string
        }

    ) {
        super()
        Object.assign(this, options)
    }
}