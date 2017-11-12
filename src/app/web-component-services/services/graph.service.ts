import { LineChart, VerticalBarChart, GraphBuilder, GraphTypeEnum } from '../../../web-components/graph';
import { Observable } from 'rxjs/Rx';

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
}
