import { FormGroup } from '@angular/forms';

import { BaseField } from '../web-components/dynamic-form/base-field.class';
import { IService } from '../../core/type-service/iservice.class';
import { IItem } from '../../repository/iitem.interface';
import { Observable } from 'rxjs/Observable';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../repository/responses';

export interface IFormsService<TItem extends IItem> {

    getInsertFields(): Observable<BaseField<any>[]>;

    getEditFields(itemId: number): Observable<BaseField<any>[]>;

    saveInsertForm(form: FormGroup, saveFunction: (item: TItem) => Observable<ResponseCreate<TItem>>): Observable<ResponseCreate<TItem>>;

    saveEditForm(form: FormGroup, saveFunction: (item: TItem) => Observable<ResponseEdit<TItem>>): Observable<ResponseEdit<TItem>>;
}