import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IFormsService } from './iforms-service.interface';
import { BaseField } from '../web-components/dynamic-form/base-field.class';
import { TextField, DropdownField, HiddenField } from '../web-components/dynamic-form/field-types';

import { IService } from '../../core/repository-service/iservice.class';
import { IItem } from '../../repository/iitem.class';
import { Observable } from 'rxjs/Observable';
import { ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../repository/responses';

//Note - nested generics are not currently supported by Typescript 2 (13.5.2017) => take types in constructor
@Injectable()
export abstract class BaseFormService<TItem extends IItem> implements IFormsService<TItem> {

    constructor(
        protected service: IService<IItem>,
    ) {
    }

    abstract getInsertFields(): Observable<BaseField<any>[]>;

    abstract getEditFields(itemId: number): Observable<BaseField<any>[]>;

    saveInsertForm(form: FormGroup, saveFunction: (item: TItem) => Observable<ResponseCreate<TItem>>): Observable<ResponseCreate<TItem>> {
        return saveFunction((form as any) as TItem);
    }

    saveEditForm(form: FormGroup, saveFunction: (item: TItem) => Observable<ResponseEdit<TItem>>): Observable<ResponseEdit<TItem>> {
        return saveFunction((form as any) as TItem);
    }
}