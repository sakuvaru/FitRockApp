// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';
import { AppConfig, UrlConfig } from '../../../../config';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientMenuItems } from '../../menu.items';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { User } from '../../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-client.component.html'
})
export class EditClientComponent extends ClientsBaseComponent implements OnInit {

    public formConfig: FormConfig<User>;

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
                this.formConfig = this.dependencies.itemServices.userService.editForm(clientId)
                    .enableDelete(false)
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('clients')]))
                    .onAfterUpdate(response => {
                        if (this.dependencies.coreServices.currentLanguage.isDifferentThanCurrent(response.item.language)) {
                            // language has changed, update it
                            this.dependencies.coreServices.currentLanguage.setLanguage(response.item.language);

                            // reload page to see new translation
                            this.dependencies.coreServices.systemService.reloadPage();
                        }
                    })
                    .onFormLoaded(form => {
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
                            menuAvatarUrl: user.avatarUrl
                        });
                    })
                    .build();
            });
    }
}
