import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { BaseModuleComponent, ComponentDependencyService } from '../../../../core';
import { User } from '../../../../models';

@Component({
    selector: 'mod-new-client',
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends BaseModuleComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.userService.buildInsertForm({
            insertQuery: (item: User) => this.dependencies.itemServices.userService.createClient(item)
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
            .onAfterInsert((response) => {
                // redirect to view client page
                super.navigate([super.getTrainerUrl('clients/edit'), response.item.id]);
            })
            .build();
    }
}
