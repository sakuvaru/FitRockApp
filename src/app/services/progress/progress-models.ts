// import graph models & use them directly
import { MultiSeries, SingleSeries } from '../../../web-components/graph';

import { ResponseMultiple } from '../../../lib/repository';

export class MultiSeriesResponse extends ResponseMultiple<MultiSeries>{
    public xAxisLabel: string;
    public yAxisLabel: string;
}

export class SingleSeriesResponse extends ResponseMultiple<SingleSeries>{
    public xAxisLabel: string;
    public yAxisLabel: string;
}
