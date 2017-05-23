// angular imports
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

// required imports
import { BaseFormService } from '../core/forms-service/base-form.service';
import { IFormsService } from '../core/forms-service/iforms-service.interface';
import { BaseField } from '../core/web-components/dynamic-form/base-field.class';
import { TextField, DropdownField, HiddenField, TextAreaField, BooleanField } from '../core/web-components/dynamic-form/field-types';
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
            new BooleanField({
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
        return this.clientService.getById(itemId).map(response => {
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
                value: response.item.birthDate
            }),
            new BooleanField({
                key: 'isFemale',
                label: 'Je žena',
                type: 'text',
                required: false,
                order: 1,
                value: response.item.isFemale
            }),
           new TextField({
                key: 'city',
                label: 'Město',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 50,
                value: response.item.city
            }),
            new TextField({
                key: 'address',
                label: 'Adresa',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 100,
                value: response.item.address
            }),
            new TextField({
                key: 'fitnessLevel',
                label: 'Úroveň',
                type: 'text',
                required: false,
                order: 1,
                value: response.item.fitnessLevel
            }),
            new TextAreaField({
                key: 'medicalCondition',
                label: 'Zdravotní stav',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 5000,
                value: response.item.medicalCondition
            }),
            new TextAreaField({
                key: 'goal',
                label: 'Cíl',
                type: 'text',
                required: false,
                order: 1,
                maxLength: 200,
                value: response.item.goal
            }),
             new TextField({
                key: 'trainerPublicNotes',
                label: 'Poznámky (soukromé',
                type: 'text',
                required: false,
                order: 1,
                hint: 'Klient tyto poznámky neuvidí',
                value: response.item.trainerPublicNotes
            }),
            ];
            return fields.sort((a, b) => a.order - b.order);
        });
    }
}