import { FormGroup } from '@angular/forms';

import { BaseField } from '../web-components/dynamic-form/base-field.class';
import { IService } from '../../core/repository-service/iservice.class';
import { IItem } from '../../repository/iitem.class';
import { Observable } from 'rxjs/Observable';

export interface IFormsService<TItem extends IItem>{

    getInsertFields(): Observable<BaseField<any>[]>;

    getEditFields(itemId: number): Observable<BaseField<any>[]>;

    saveInsertForm(form: FormGroup): Observable<IItem>;

    saveEditForm(form: FormGroup): Observable<IItem>;
}