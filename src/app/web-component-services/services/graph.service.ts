import { Observable } from 'rxjs/Rx';

import { GraphBuilder, GraphTypeEnum, LineChart, PieChart, VerticalBarChart } from '../../../web-components/graph';

export class GraphService {

    lineChart(
        graph: Observable<LineChart>,
    ): GraphBuilder<LineChart> {
        return new GraphBuilder<LineChart>(graph, GraphTypeEnum.LineChart);
    }

    verticalBarChart(
        graph: Observable<VerticalBarChart>,
    ): GraphBuilder<VerticalBarChart> {
        return new GraphBuilder<VerticalBarChart>(graph, GraphTypeEnum.VerticalBarChart);
    }

    pieChart(
        graph: Observable<PieChart>,
    ): GraphBuilder<PieChart> {
        return new GraphBuilder<PieChart>(graph, GraphTypeEnum.PieChart);
    }
}
