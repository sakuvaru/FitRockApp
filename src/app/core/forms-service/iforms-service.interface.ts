import { FormGroup } from '@angular/forms';

import { BaseField } from '../dynamic-form/base-field.class';
import { IService } from '../../core/repository-service/iservice.class';
import { IItem } from '../../repository/iitem.class';
import { Observable } from 'rxjs/Observable';

export interface IFormsService {

    getInsertFields(): BaseField<any>[];

    getEditFields(itemId: number): BaseField<any>[];

    saveInsertForm(form: FormGroup): Observable<IItem>;

    saveEditForm(form: FormGroup): Observable<IItem>;
}