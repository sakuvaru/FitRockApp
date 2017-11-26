import { Observable } from 'rxjs/Observable';
import { DataFormBuilder } from '../../../web-components/data-form';
import { AppConfig } from '../../config';
import {
    ResponseFormEdit, ResponseFormInsert, IItem, ResponseEdit, ResponseCreate,
    ResponseDelete
} from '../../../lib/repository';

export class DataFormService {

    editForm<TItem extends IItem>(
        type: string,
        formDefinition: Observable<ResponseFormEdit<TItem>>,
        edit: (formData: Object) => Observable<ResponseCreate<TItem>>,
        options?: {
            delete?: (formData: Object) => Observable<ResponseDelete>
        }
    ): DataFormBuilder<TItem> {
        return new DataFormBuilder<TItem>(type, true, false, formDefinition, edit,
            {
                deleteFunction: options ? options.delete : undefined
            });
    }

    insertForm<TItem extends IItem>(
        type: string,
        formDefinition: Observable<ResponseFormInsert>,
        create: (formData: Object) => Observable<ResponseCreate<TItem>>,
        options?: {
        }
    ): DataFormBuilder<TItem> {
        return new DataFormBuilder<TItem>(type, false, true, formDefinition, create, {
        });
    }

}




