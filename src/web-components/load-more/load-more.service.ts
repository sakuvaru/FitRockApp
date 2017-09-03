import { LoadMoreBuilder } from './load-more-builder';
import { MultipleItemQuery, IItem, ResponseMultiple } from '../../lib/repository';
import { Observable } from 'rxjs/Rx';

export class LoadMoreService {

    loadMore<TItem extends IItem>(
        loadQuery: (searchTerm: string) => MultipleItemQuery<TItem>,
        loadResolver: (query: MultipleItemQuery<TItem>) => Observable<ResponseMultiple<TItem>>){
        return new LoadMoreBuilder<TItem>(loadQuery, loadResolver);
    }
}