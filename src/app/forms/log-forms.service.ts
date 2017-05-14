// angular imports
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

// required imports
import { BaseFormService } from '../core/forms-service/base-form.service';
import { IFormsService } from '../core/forms-service/iforms-service.interface';
import { BaseField } from '../core/dynamic-form/base-field.class';
import { TextField, DropdownField, HiddenField, TextAreaField } from '../core/dynamic-form/field-types';
import { Observable } from 'rxjs/Observable';

// service specific imports
import { Log } from '../models/log.class';
import { LogService } from '../services/log.service';

@Injectable()
export class LogFormsService extends BaseFormService<Log> implements IFormsService<Log> {

    constructor(
        protected logService: LogService
    ) {
        super(logService)
    }

    getInsertFields(): Observable<BaseField<any>[]> {
        var fields: BaseField<any>[] = [
            new TextField({
                key: 'errorMessage',
                label: 'Error message',
                type: 'text',
                required: true,
                order: 1,
                maxLength: 100,
            }),
            new TextAreaField({
                key: 'stacktrace',
                label: 'Stacktrace',
                type: 'text',
                value: '',
                required: false,
                order: 2,
                maxLength: 500,
            }),
            new TextField({
                key: 'user',
                label: 'User',
                value: '',
                required: false,
                order: 3
            }),
        ];

        var sortedFields = fields.sort((a, b) => a.order - b.order);

        return Observable.of(sortedFields);
    }

    getEditFields(itemId: number): Observable<BaseField<any>[]> {
        return this.logService.getById(itemId).map(item => {
            var fields: BaseField<any>[] = [
                new HiddenField({
                    key: 'id',
                    required: true,
                    order: 1,
                    value: itemId
                }),
                new TextField({
                    key: 'errorMessage',
                    label: 'Error message',
                    type: 'text',
                    required: true,
                    order: 1,
                    value: item.errorMessage
                }),
                new TextAreaField({
                    key: 'stacktrace',
                    label: 'Stacktrace',
                    type: 'text',
                    required: false,
                    order: 2,
                    maxLength: 500,
                    value: item.stacktrace
                }),
                new TextField({
                    key: 'user',
                    label: 'User',
                    required: false,
                    order: 3,
                    value: item.user
                }),
            ];
            return fields.sort((a, b) => a.order - b.order);
        });
    }
}