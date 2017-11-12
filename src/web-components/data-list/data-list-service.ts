import { DataListBuilder } from './data-list-builder';
import { DataListField } from './data-list-field.class';
import { IItem, MultipleItemQuery, ResponseMultiple } from '../../lib/repository';
import { Observable } from 'rxjs/Observable';

export class DataListService {

    dataList<TItem extends IItem>(
        /**
        * Used to specify query that loads items
        */
        loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>,
    ): DataListBuilder<TItem> {
        return new DataListBuilder<TItem>(loadQuery);
    }

}




