// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

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

    private formConfig: FormConfig<User>;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService, activatedRoute, { subscribeToClient: false })

    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(this.getFormObservable());
        super.initClientSubscriptions();
    }

    private getFormObservable(): Observable<any> {
        return this.clientIdChange
            .takeUntil(this.ngUnsubscribe)
            .switchMap(clientId => this.dependencies.itemServices.userService.editForm(clientId))
            .map(form => {
                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());
                form.onAfterDelete(() => super.navigate([this.getTrainerUrl('clients')]));

                var user = form.getItem();

                this.setConfig({
                    menuItems: new ClientMenuItems(user.id).menuItems,
                    menuTitle: {
                        key: 'module.clients.viewClientSubtitle',
                        data: { 'fullName': user.getFullName() }
                    },
                    componentTitle: {
                        'key': 'module.clients.editClient'
                    }
                });

                // get form
                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}