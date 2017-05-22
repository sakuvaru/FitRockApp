import { FormGroup } from '@angular/forms';

import { BaseField } from '../web-components/dynamic-form/base-field.class';
import { IService } from '../../core/repository-service/iservice.class';
import { IItem } from '../../repository/iitem.class';
import { Observable } from 'rxjs/Observable';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../repository/responses';

export interface IFormsService<TItem extends IItem>{

    getInsertFields(): Observable<BaseField<any>[]>;

    getEditFields(itemId: number): Observable<BaseField<any>[]>;

    saveInsertForm(form: FormGroup): Observable<ResponseCreate<IItem>>;

    saveEditForm(form: FormGroup): Observable<ResponseEdit<IItem>>;
}