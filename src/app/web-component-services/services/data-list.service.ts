import { IItem, MultipleItemQuery, ResponseMultiple } from '../../../lib/repository';
import { Observable } from 'rxjs/Observable';
import { DataListBuilder } from '../../../web-components/data-list';
import { AppConfig } from '../../config';

export class DataListService {

    dataList<TItem extends IItem>(
        /**
        * Used to specify query that loads items
        */
        loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>,
    ): DataListBuilder<TItem> {
        return new DataListBuilder<TItem>(loadQuery, AppConfig.NoDataImageUrl);
    }

}




