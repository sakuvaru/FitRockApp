import { Observable } from 'rxjs/Rx';

import {
    GraphBuilder,
    GraphTypeEnum,
    LinearGaugeChart,
    LineChart,
    PieChart,
    VerticalBarChart,
} from '../../../web-components/graph';

export class GraphService {

    lineChart(
        graph: Observable<LineChart>,
        options?: {
            width?: string,
            height?: string
        }
    ): GraphBuilder<LineChart> {
        return new GraphBuilder<LineChart>(graph, GraphTypeEnum.LineChart, options);
    }

    verticalBarChart(
        graph: Observable<VerticalBarChart>,
        options?: {
            width?: string,
            height?: string
        }
    ): GraphBuilder<VerticalBarChart> {
        return new GraphBuilder<VerticalBarChart>(graph, GraphTypeEnum.VerticalBarChart, options);
    }

    pieChart(
        graph: Observable<PieChart>,
        options?: {
            width?: string,
            height?: string
        }
    ): GraphBuilder<PieChart> {
        return new GraphBuilder<PieChart>(graph, GraphTypeEnum.PieChart, options);
    }

    linearGaugeChart(
        graph: Observable<LinearGaugeChart>,
        options?: {
            width?: string,
            height?: string
        }
    ): GraphBuilder<LinearGaugeChart> {
        return new GraphBuilder<LinearGaugeChart>(graph, GraphTypeEnum.LinearGaugeChart, options);
    }
}
