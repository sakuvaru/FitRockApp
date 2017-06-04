// angular imports
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// required imports
import { BaseFormService } from '../core';
import {
    BaseField, TextField, DropdownField, HiddenField, TextAreaField,
    BooleanField, RadioBooleanField, DateField, DropdownFieldOption
} from '../../lib/web-components'

// service specific imports
import { User } from '../models';
import { UserService } from '../services';

@Injectable()
export class UserFormsService extends BaseFormService<User>{

    constructor(
        protected userService: UserService
    ) {
        super(userService)
    }

    getInsertFields(): Observable<BaseField<any>[]> {
        var fields: BaseField<any>[] = [
            new TextField({
                key: 'email',
                label: 'E-mail',
                value: '',
                required: true,
                maxLength: 100,
                keyAlias: 'codename'
            }),
            new TextField({
                key: 'firstName',
                label: 'Jméno',
                required: true,
                maxLength: 100
            }),
            new TextField({
                key: 'lastName',
                label: 'Příjmení',
                required: true,
                maxLength: 100
            }),
            new DateField({
                key: 'birthDay',
                label: 'Datum narození',
                value: null,
                required: true,
            }),
            new RadioBooleanField({
                trueOptionLabel: "Žena",
                falseOptionLabel: "Muž",
                key: 'isFemale',
                label: 'Je žena',
                value: false,
                required: true,
            }),
            new TextField({
                key: 'city',
                label: 'Město',
                required: false,
                maxLength: 50
            }),
            new TextField({
                key: 'address',
                label: 'Adresa',
                required: false,
                maxLength: 100
            }),
            new DropdownField({
                dropdownOptions: [
                    new DropdownFieldOption("Beginner", "Začátečník"),
                    new DropdownFieldOption("Intermediate", "Středně pokročilý"),
                    new DropdownFieldOption("Advanced", "Pokročilý"),
                    new DropdownFieldOption("FitnessCompetitor", "Závodník fitness"),
                ],
                width: 250,
                key: 'fitnessLevel',
                label: 'Úroveň',
                required: false,
            }),
            new TextAreaField({
                key: 'medicalCondition',
                label: 'Zdravotní stav',
                required: false,
                maxLength: 5000
            }),
            new TextAreaField({
                key: 'goal',
                label: 'Cíl',
                required: false,
                maxLength: 200
            }),
            new TextAreaField({
                key: 'trainerPrivateNotes',
                label: 'Poznámky (soukromé)',
                required: false,
                hint: 'Klient tyto poznámky neuvidí'
            }),
            new TextAreaField({
                key: 'trainerPublicNotes',
                label: 'Poznámky pro klienta',
                required: false,
                hint: 'Klient může tyto poznámky vidět'
            }),
        ];

        return Observable.of(fields);
    }

    getEditFields(itemId: number): Observable<BaseField<any>[]> {
        return this.userService.getById(itemId).map(response => {
            var fields: BaseField<any>[] = [
                new HiddenField({
                    key: 'id',
                    required: true,
                }),
                new TextField({
                    key: 'firstName',
                    label: 'Jméno',
                    required: true,
                    maxLength: 100,
                    value: response.item.firstName
                }),
                new TextField({
                    key: 'lastName',
                    label: 'Příjmení',
                    required: true,
                    maxLength: 100,
                    value: response.item.lastName
                }),
                new DateField({
                    key: 'birthDay',
                    label: 'Datum narození',
                    required: false,
                    value: response.item.birthDate
                }),
                new RadioBooleanField({
                    trueOptionLabel: "Žena",
                    falseOptionLabel: "Muž",
                    key: 'isFemale',
                    label: 'Je žena',
                    value: response.item.isFemale,
                    required: true,
                }),
                new TextField({
                    key: 'city',
                    label: 'Město',
                    required: false,
                    maxLength: 50,
                    value: response.item.city
                }),
                new TextField({
                    key: 'address',
                    label: 'Adresa',
                    required: false,
                    maxLength: 100,
                    value: response.item.address
                }),
                new DropdownField({
                    dropdownOptions: [
                        new DropdownFieldOption("Novice", "Nováček"),
                        new DropdownFieldOption("Intermediate", "Středně pokročilý"),
                        new DropdownFieldOption("Advanced", "Pokročilý"),
                        new DropdownFieldOption("FitnessCompetitor", "Závodník fitness"),
                    ],
                    width: 250,
                    key: 'fitnessLevel',
                    label: 'Úroveň',
                    required: false,
                    value: response.item.fitnessLevel
                }),
                new TextAreaField({
                    key: 'medicalCondition',
                    label: 'Zdravotní stav',
                    required: false,
                    maxLength: 5000,
                    value: response.item.medicalCondition
                }),
                new TextAreaField({
                    key: 'goal',
                    label: 'Cíl',
                    required: false,
                    maxLength: 200,
                    value: response.item.goal
                }),
                new TextField({
                    key: 'trainerPublicNotes',
                    label: 'Poznámky (soukromé',
                    required: false,
                    hint: 'Klient tyto poznámky neuvidí',
                    value: response.item.trainerPublicNotes
                }),
            ];
            return fields;
        });
    }
}