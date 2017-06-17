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
import { DynamicFormService } from '../../lib/web-components';

@Injectable()
export class UserFormsService extends BaseFormService<User>{

    constructor(
        protected userService: UserService,
        protected dynamicFormService: DynamicFormService
    ) {
        super(userService, dynamicFormService,
        {
            excludedEditFields: ['email']
        })
    }

    getBaseFormFields(): Observable<BaseField<any>[]> {
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
                labelKey: 'form.user.firstName',
                required: true,
                maxLength: 100
            }),
            new TextField({
                key: 'lastName',
                labelKey: 'form.user.lastName',
                required: true,
                maxLength: 100
            }),
            new DateField({
                key: 'birthDate',
                labelKey: 'form.user.birthDate',
                required: true,
            }),
            new RadioBooleanField({
                trueOptionLabel: "Žena",
                falseOptionLabel: "Muž",
                key: 'isFemale',
                required: true,
                defaultValue: false
            }),
            new TextField({
                key: 'city',
                labelKey: 'form.user.city',
                required: false,
                maxLength: 50
            }),
            new TextField({
                key: 'address',
                labelKey: 'form.user.address',
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
                labelKey: 'form.user.level',
                required: false,
            }),
            new TextAreaField({
                key: 'medicalCondition',
                labelKey: 'form.user.healthStatus',
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
                labelKey: 'form.user.privateNotes',
                required: false,
                hintKey: 'form.user.privateNotesHint',
                minAutosizeRows: 6
            }),
            new TextAreaField({
                key: 'trainerPublicNotes',
                labelKey: 'form.user.publicNotes',
                required: false,
                hintKey: 'form.user.publicNotesHint',
                minAutosizeRows: 6
            }),
        ];

        return Observable.of(fields);
    }
}