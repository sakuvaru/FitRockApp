import { DataListBuilder } from './data-list-builder';
import { DataListField } from './data-list-field.class';
import { IItem, MultipleItemQuery, ResponseMultiple } from '../../lib/repository';
import { Observable } from 'rxjs/Observable';

export class DataListService {

    dataList<TItem extends IItem>(
        /**
        * Method that is used to get observable out of loadQuery.
        * Usually this should include 'takeUntil(this.ngUnsubscribe)' to ensure
        * that requests are cancelled if they are not required (e.g. after destroying component)
        */
        loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>,
        /**
        * Used to specify query that loads items
        */
        loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>,
        /**
        * Fields in the data list
        */
        fields: DataListField<any>[]
    ): DataListBuilder<TItem> {
        return new DataListBuilder<TItem>(loadResolver, loadQuery, fields);
    }

}




