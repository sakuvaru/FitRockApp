import { Observable } from 'rxjs/Observable';
import { DataFormBuilder } from '../../../web-components/data-form';
import { AppConfig } from '../../config';
import { ResponseFormEdit, ResponseFormInsert, IItem } from '../../../lib/repository';

export class DataFormService {

    editForm<TItem extends IItem>(
        formDefinition: Observable<ResponseFormEdit<TItem>>
    ): DataFormBuilder<TItem> {
        return new DataFormBuilder<TItem>(true, false, formDefinition);
    }

    insertForm<TItem extends IItem>(
        formDefinition: Observable<ResponseFormInsert>
    ): DataFormBuilder<TItem> {
        return new DataFormBuilder<TItem>(false, true, formDefinition);
    }

}




