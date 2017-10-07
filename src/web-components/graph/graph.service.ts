import { LineChart, VerticalBarChart } from './graph-types';
import { GraphBuilder } from './graph.builder';
import { GraphTypeEnum } from './graph-type.enum';
import { Observable } from 'rxjs/Rx';

export class GraphService {

    lineChart(
        graph: Observable<LineChart>,
    ): GraphBuilder<LineChart> {
        return new GraphBuilder<LineChart>(graph, GraphTypeEnum.LineChart)
    }

    verticalBarChart(
        graph: Observable<VerticalBarChart>,
    ): GraphBuilder<VerticalBarChart> {
        return new GraphBuilder<VerticalBarChart>(graph, GraphTypeEnum.VerticalBarChart)
    }
}