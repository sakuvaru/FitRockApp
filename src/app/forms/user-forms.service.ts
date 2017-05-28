// angular imports
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

// required imports
import { BaseFormService } from '../core/forms-service/base-form.service';
import { IFormsService } from '../core/forms-service/iforms-service.interface';
import { BaseField } from '../core/web-components/dynamic-form/base-field.class';
import { TextField, DropdownField, HiddenField, TextAreaField, BooleanField, RadioBooleanField, DateField } from '../core/web-components/dynamic-form/field-types';
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
            new TextField({
                key: 'email',
                label: 'E-mail',
                type: 'text',
                value: '',
                required: true,
                maxLength: 100
            }),
            new TextField({
                key: 'firstName',
                label: 'Jméno',
                type: 'text',
                required: true,
                maxLength: 100
            }),
            new TextField({
                key: 'lastName',
                label: 'Příjmení',
                type: 'text',
                required: true,
                maxLength: 100
            }),
            new DateField({
                key: 'birthDay',
                label: 'Datum narození',
                type: 'text',
                value: '',
                required: true,
            }),
            new RadioBooleanField(
                'Žena',
                'Muž',
                {
                    key: 'isFemale',
                    label: 'Je žena',
                    type: 'text',
                    value: false,
                    required: true,
                }),
            new TextField({
                key: 'city',
                label: 'Město',
                type: 'text',
                required: false,
                maxLength: 50
            }),
            new TextField({
                key: 'address',
                label: 'Adresa',
                type: 'text',
                required: false,
                maxLength: 100
            }),
            new TextField({
                key: 'fitnessLevel',
                label: 'Úroveň',
                type: 'text',
                required: false,
            }),
            new TextAreaField({
                key: 'medicalCondition',
                label: 'Zdravotní stav',
                type: 'text',
                required: false,
                maxLength: 5000
            }),
            new TextAreaField({
                key: 'goal',
                label: 'Cíl',
                type: 'text',
                required: false,
                maxLength: 200
            }),
            new TextField({
                key: 'trainerPublicNotes',
                label: 'Poznámky (soukromé',
                type: 'text',
                required: false,
                hint: 'Klient tyto poznámky neuvidí'
            }),
        ];

        return Observable.of(fields);
    }

    getEditFields(itemId: number): Observable<BaseField<any>[]> {
        return this.clientService.getById(itemId).map(response => {
            var fields: BaseField<any>[] = [
                new HiddenField({
                    key: 'id',
                    required: true,
                }),
                new TextField({
                    key: 'firstName',
                    label: 'Jméno',
                    type: 'text',
                    required: true,
                    maxLength: 100,
                    value: response.item.firstName
                }),
                new TextField({
                    key: 'lastName',
                    label: 'Příjmení',
                    type: 'text',
                    required: true,
                    maxLength: 100,
                    value: response.item.lastName
                }),
                new DateField({
                    key: 'birthDay',
                    label: 'Datum narození',
                    type: 'text',
                    required: false,
                    value: response.item.birthDate
                }),
                new RadioBooleanField(
                    'Žena',
                    'Muž',
                    {
                        key: 'isFemale',
                        label: 'Je žena',
                        type: 'text',
                        value: response.item.isFemale,
                        required: true,
                    }),
                new TextField({
                    key: 'city',
                    label: 'Město',
                    type: 'text',
                    required: false,
                    maxLength: 50,
                    value: response.item.city
                }),
                new TextField({
                    key: 'address',
                    label: 'Adresa',
                    type: 'text',
                    required: false,
                    maxLength: 100,
                    value: response.item.address
                }),
                new TextField({
                    key: 'fitnessLevel',
                    label: 'Úroveň',
                    type: 'text',
                    required: false,
                    value: response.item.fitnessLevel
                }),
                new TextAreaField({
                    key: 'medicalCondition',
                    label: 'Zdravotní stav',
                    type: 'text',
                    required: false,
                    maxLength: 5000,
                    value: response.item.medicalCondition
                }),
                new TextAreaField({
                    key: 'goal',
                    label: 'Cíl',
                    type: 'text',
                    required: false,
                    maxLength: 200,
                    value: response.item.goal
                }),
                new TextField({
                    key: 'trainerPublicNotes',
                    label: 'Poznámky (soukromé',
                    type: 'text',
                    required: false,
                    hint: 'Klient tyto poznámky neuvidí',
                    value: response.item.trainerPublicNotes
                }),
            ];
            return fields;
        });
    }
}