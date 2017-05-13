// angular imports
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

// required imports
import { BaseFormService } from '../core/forms-service/base-form.service';
import { IFormsService } from '../core/forms-service/iforms-service.interface';
import { BaseField } from '../core/dynamic-form/base-field.class';
import { TextField, DropdownField, HiddenField } from '../core/dynamic-form/field-types';

// service specific imports
import { Log } from '../models/log.class';
import { LogService } from '../services/log.service';

@Injectable()
export class LogFormsService extends BaseFormService<Log> implements IFormsService {

    constructor(
        protected logService: LogService
    ){
        super(logService)
    }

     getInsertFields(): BaseField<any>[] {
        var fields: BaseField<any>[] = [
            new TextField({
                key: 'errorMessage',
                label: 'Error message',
                type: 'text',
                required: true,
                order: 1
            }),
            new TextField({
                key: 'stacktrace',
                label: 'Stacktrace',
                type: 'text',
                value: '',
                required: false,
                order: 2
            }),
            new TextField({
                key: 'user',
                label: 'User',
                value: '',
                required: false,
                order: 3
            }),
        ];
        return fields.sort((a, b) => a.order - b.order);
    }

    getEditFields(itemId: number): BaseField<any>[] {
        var fields: BaseField<any>[] = [
            new HiddenField({
                key: 'id',
                required: true,
                order: 1,
                value: itemId,
            }),
            new TextField({
                key: 'errorMessage',
                label: 'Error message',
                type: 'text',
                required: true,
                order: 1
            }),
            new TextField({
                key: 'stacktrace',
                label: 'Stacktrace',
                type: 'text',
                value: '',
                required: false,
                order: 2
            }),
            new TextField({
                key: 'user',
                label: 'User',
                value: '',
                required: false,
                order: 3
            }),
        ];
        return fields.sort((a, b) => a.order - b.order);
    }
}