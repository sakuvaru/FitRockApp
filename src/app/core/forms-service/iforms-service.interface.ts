import { FormGroup } from '@angular/forms';

import { BaseField } from '../web-components/dynamic-form/base-field.class';
import { IService } from '../../core/type-service/iservice.class';
import { IItem } from '../../repository/interfaces/iitem.interface';
import { Observable } from 'rxjs/Observable';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../repository/models/responses';
import { FormConfig } from '../../core/web-components/dynamic-form/form-config.class';

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