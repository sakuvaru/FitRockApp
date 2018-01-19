import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { User } from 'app/models';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientModuleComponent } from '../../base-client-module.component';

@Component({
    selector: 'mod-edit-client',
    templateUrl: 'edit-client.component.html'
})
export class EditClientComponent extends BaseClientModuleComponent implements OnInit, OnChanges {

    @Output() userLoaded = new EventEmitter<User>();

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.client) {
            this.init();
        }
    }

    private init(): void {
        this.formConfig = this.dependencies.itemServices.userService.buildEditForm(this.client.id)
            .enableDelete(false)
            .onAfterDelete(() => super.navigate([this.getTrainerUrl('clients')]))
            .onAfterEdit(response => {
                // no need to set language because language was not changed for current user
            })
            .onEditFormLoaded(form => {
                const user = form.item;
                if (user) {
                    this.userLoaded.next(user);
                }
            })
            .optionLabelResolver((field, label) => {
                if (field.key === 'Language') {
                    if (label === 'Default') {
                        return super.translate('shared.language.default');
                    } else if (label === 'Cz') {
                        return super.translate('shared.language.cz');
                    } else if (label === 'En') {
                        return super.translate('shared.language.en');
                    }
                }
                if (field.key === 'FitnessLevel') {
                    if (label === 'Beginner') {
                        return super.translate('form.user.beginner');
                    } else if (label === 'Intermediate') {
                        return super.translate('form.user.intermediate');
                    } else if (label === 'FitnessCompetitor') {
                        return super.translate('form.user.fitnessCompetitor');
                    } else if (label === 'Advanced') {
                        return super.translate('form.user.advanced');
                    }
                }
                return Observable.of(label);
            })
            .build();
    }
}
