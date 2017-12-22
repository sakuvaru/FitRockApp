// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { DataFormConfig } from '../../../../../web-components/data-form';
import { User } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-client.component.html'
})
export class EditClientComponent extends ClientsBaseComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService, activatedRoute);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        };
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(this.getInitFormObservable());
        super.initClientSubscriptions();
    }

    private getInitFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .map(clientId => {
                this.formConfig = this.dependencies.itemServices.userService.buildEditForm(clientId)
                    .enableDelete(false)
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('clients')]))
                    .onAfterEdit(response => {
                        // no need to set language because language was not changed for current user
                    })
                    .onEditFormLoaded(form => {
                        const user = form.item;

                        this.setConfig({
                            menuItems: new ClientMenuItems(user.id).menuItems,
                            menuTitle: {
                                key: 'module.clients.viewClientSubtitle',
                                data: { 'fullName': user.getFullName() }
                            },
                            componentTitle: {
                                'key': 'module.clients.editClient'
                            },
                            menuAvatarUrl: super.getAvatarOrGravatarFromFormItem(user)
                        });
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
            });
    }
}
