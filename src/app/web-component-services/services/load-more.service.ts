import { LoadMoreBuilder } from '../../../web-components/load-more';
import { MultipleItemQuery, IItem } from '../../../lib/repository';
import { Observable } from 'rxjs/Rx';

export class LoadMoreService {

    loadMore<TItem extends IItem>(
        query: (search: string) => MultipleItemQuery<TItem>
    ) {
        return new LoadMoreBuilder(query);
    }
}
