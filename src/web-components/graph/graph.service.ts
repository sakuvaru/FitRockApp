import { BaseGraph, LineChart, VerticalBarChart } from './graph-types';
import { GraphBuilder } from './graph.builder';
import { MultiSeries, SingleSeries } from './graph-models';
import { Observable } from 'rxjs/Rx';

export class GraphService {

    lineChart(
        data: Observable<MultiSeries[]>
    ): GraphBuilder<LineChart> {
        return new GraphBuilder<LineChart>(new LineChart({
            data: data,

        }))
    }

    verticalBarChart(
        data: Observable<SingleSeries[]>
    ): GraphBuilder<VerticalBarChart> {
        return new GraphBuilder<VerticalBarChart>(new VerticalBarChart({
            data: data
        }))
    }
}