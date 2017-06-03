import { Observable } from 'rxjs/Observable';

import { BaseField, FormConfig } from '../../../lib/web-components.lib';
import { IService } from '../../core/type-service/iservice.class';
import { IItem, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../../lib/repository.lib';

export interface IFormsService<TItem extends IItem> {

    getInsertFields(): Observable<BaseField<any>[]>;

    getEditFields(itemId: number): Observable<BaseField<any>[]>;

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
        itemId: number,
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