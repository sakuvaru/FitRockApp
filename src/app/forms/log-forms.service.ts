// angular imports
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

// required imports
import { BaseFormService } from '../core/forms-service/base-form.service';
import { IFormsService } from '../core/forms-service/iforms-service.interface';
import { BaseField } from '../core/web-components/dynamic-form/base-field.class';
import { TextField, DropdownField, HiddenField, TextAreaField } from '../core/web-components/dynamic-form/field-types';
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
                required: true,
                maxLength: 100,
            }),
            new TextAreaField({
                key: 'stacktrace',
                label: 'Stacktrace',
                value: '',
                required: false,
                maxLength: 5000,
            }),
            new TextField({
                key: 'user',
                label: 'User',
                value: '',
                required: false,
            }),
        ];

        return Observable.of(fields);
    }

    getEditFields(itemId: number): Observable<BaseField<any>[]> {
        return this.logService.getById(itemId).map(response => {
            var fields: BaseField<any>[] = [
                new HiddenField({
                    key: 'id',
                    required: true,
                    value: itemId
                }),
                new TextField({
                    key: 'errorMessage',
                    label: 'Error message',
                    required: true,
                    value: response.item.errorMessage
                }),
                new TextAreaField({
                    key: 'stacktrace',
                    label: 'Stacktrace',
                    required: false,
                    maxLength: 5000,
                    value: response.item.stacktrace
                }),
                new TextField({
                    key: 'user',
                    label: 'User',
                    required: false,
                    value: response.item.user
                }),
            ];
            return fields;
        });
    }
}