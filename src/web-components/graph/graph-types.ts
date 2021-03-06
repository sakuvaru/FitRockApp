import { Observable } from 'rxjs/Rx';

import { WebColorEnum } from '../shared/enums/web-color.enum';
import { MultiSeries, SingleSeries } from './graph-models';
import { GraphTypeEnum } from './graph-type.enum';

export abstract class BaseGraph {

    abstract data: MultiSeries[] | SingleSeries[];
    abstract type: GraphTypeEnum;
}

export class LineChart extends BaseGraph {

    public readonly type: GraphTypeEnum = GraphTypeEnum.LineChart;

    // configurable
    public xAxisLabel: Observable<string>;
    public yAxisLabel: Observable<string>;

    // options
    public showXAxis = true;
    public showYAxis = true;
    public gradient = false;
    public showXAxisLabel = true;
    public showYAxisLabel = true;
    public legend = false;
    public autoScale = true;

    constructor(
        public data: MultiSeries[],
        options?: {
            xAxisLabel?: Observable<string>,
            yAxisLabel?: Observable<string>,
            showXAxis?: boolean,
            showYAxis?: boolean,
            gradient?: boolean,
            autoScale?: boolean,
            legend?: boolean
        }
    ) {
        super();
        if (options) {
            Object.assign(this, options);
        }
    }
}

export class VerticalBarChart extends BaseGraph {

    public readonly type: GraphTypeEnum = GraphTypeEnum.VerticalBarChart;

    // configurable
    public xAxisLabel: Observable<string>;
    public yAxisLabel: Observable<string>;

    // options
    public showXAxis = true;
    public showYAxis = true;
    public gradient = false;
    public showXAxisLabel = true;
    public showYAxisLabel = true;
    public autoScale = true;

    constructor(
        public data: SingleSeries[],
        options?: {
            xAxisLabel?: Observable<string>,
            yAxisLabel?: Observable<string>
        }

    ) {
        super();
        if (options) {
            Object.assign(this, options);
        }
    }
}

export class PieChart extends BaseGraph {

    public readonly type: GraphTypeEnum = GraphTypeEnum.PieChart;

    // options
    public gradient = false;
    public autoScale = true;
    public labelFormatting?: (value: any) => string;

    public showLabels: boolean = true;

    constructor(
        public data: SingleSeries[],
        options?: {
            showLabels?: boolean,
            labelFormatting?: (value: any) => string;
        }
    ) {
        super();
        if (options) {
            Object.assign(this, options);
        }
    }
}


export class LinearGaugeChart extends BaseGraph {

    /**
     * Data are not required for this graph
     */
    public data: any = undefined;

    public readonly type: GraphTypeEnum = GraphTypeEnum.LinearGaugeChart;

    public animations: boolean = true;
    public color: WebColorEnum = WebColorEnum.Blue;
    public units?: Observable<string>;
    public previousValue?: number;
    public labelFormatting?: (value: any) => string;

    constructor(
        public min: number,
        public max: number,
        public value: number,
        options?: {
            previousValue?: number,
            animations?: boolean,
            color?: WebColorEnum,
            units?: Observable<string>,
            labelFormatting?: (value: any) => string;
        }
    ) {
        super();
        if (options) {
            Object.assign(this, options);
        }
    }
}
