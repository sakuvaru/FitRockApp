import { Observable } from 'rxjs/Observable';

import { BaseField, FormConfig } from '../../../lib/web-components';
import { IService } from '../../core/type-service/iservice.class';
import { IItem, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../../lib/repository';

export interface IFormsService<TItem extends IItem> {

    getBaseFormFields(options?:
        {
            excludeFields?: string[]
        }): Observable<BaseField<any>[]>;

    getInsertForm(
        options?: {
            saveFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>,
            showSnackBar?: boolean,
            snackBarText?: string,
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            submitText?: string,
            errorCallback?: (err: string) => void
        }): FormConfig<TItem>;

    getEditForm(
        config: {
            itemId?: number,
            item?: TItem
        },
        options?: {
            saveFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>,
            showSnackBar?: boolean,
            snackBarText?: string,
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            submitText?: string,
            errorCallback?: (err: string) => void
        }): FormConfig<TItem>;
}