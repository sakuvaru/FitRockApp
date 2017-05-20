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
import { User } from '../models/user.class';
import { UserService } from '../services/user.service';

@Injectable()
export class UserFormsService extends BaseFormService<User> implements IFormsService<User> {

    constructor(
        protected clientService: UserService
    ) {
        super(clientService)
    }

    getInsertFields(): Observable<BaseField<any>[]> {
        var fields: BaseField<any>[] = [
            new HiddenField({
                key: 'trainerId',
                required: true,
                order: 1,
            }),
             new TextField({
                key: 'email',
                label: 'E-mail',
                type: 'text',
                value: '',
                required: true,
                order: 1,
                maxLength: 100
            }),
            new TextField({
                key: 'birthDay',
                label: 'Datum narození',
                type: 'text',
                value: '',
                required: false,
                order: 1,
            }),
            new TextField({
                key: 'isFemale',
                label: 'Je žena',
                type: 'text',
                value: false,
                required: false,
                order: 1,
            }),
           new TextField({
                key: 'city',
                label: 'Město',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 50
            }),
            new TextField({
                key: 'address',
                label: 'Adresa',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 100
            }),
            new TextField({
                key: 'fitnessLevel',
                label: 'Úroveň',
                type: 'text',
                required: false,
                order: 1,
            }),
            new TextAreaField({
                key: 'medicalCondition',
                label: 'Zdravotní stav',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 5000
            }),
            new TextAreaField({
                key: 'goal',
                label: 'Cíl',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 200
            }),
             new TextField({
                key: 'trainerPublicNotes',
                label: 'Poznámky (soukromé',
                type: 'text',
                required: false,
                order: 1,
                hint: 'Klient tyto poznámky neuvidí'
            }),
        ];

        var sortedFields = fields.sort((a, b) => a.order - b.order);

        return Observable.of(sortedFields);
    }

    getEditFields(itemId: number): Observable<BaseField<any>[]> {
        return this.clientService.getById(itemId).map(item => {
           var fields: BaseField<any>[] = [
            new HiddenField({
                key: 'id',
                required: true,
                order: 1,
            }),
            new TextField({
                key: 'birthDay',
                label: 'Datum narození',
                type: 'text',
                required: false,
                order: 1,
                value: item.birthDate
            }),
            new TextField({
                key: 'isFemale',
                label: 'Je žena',
                type: 'text',
                required: false,
                order: 1,
                value: item.isFemale
            }),
           new TextField({
                key: 'city',
                label: 'Město',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 50,
                value: item.city
            }),
            new TextField({
                key: 'address',
                label: 'Adresa',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 100,
                value: item.address
            }),
            new TextField({
                key: 'fitnessLevel',
                label: 'Úroveň',
                type: 'text',
                required: false,
                order: 1,
                value: item.fitnessLevel
            }),
            new TextAreaField({
                key: 'medicalCondition',
                label: 'Zdravotní stav',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 5000,
                value: item.medicalCondition
            }),
            new TextAreaField({
                key: 'goal',
                label: 'Cíl',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 200,
                value: item.goal
            }),
             new TextField({
                key: 'trainerPublicNotes',
                label: 'Poznámky (soukromé',
                type: 'text',
                required: false,
                order: 1,
                hint: 'Klient tyto poznámky neuvidí',
                value: item.trainerPublicNotes
            }),
            ];
            return fields.sort((a, b) => a.order - b.order);
        });
    }
}