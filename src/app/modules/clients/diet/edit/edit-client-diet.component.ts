// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../../core';

// required by component
import { Observable } from 'rxjs/Rx';
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditDietMenuItems } from '../../menu.items';
import { Diet } from '../../../../models';

@Component({
    templateUrl: 'edit-client-diet.component.html'
})
export class EditClientDietComponent extends ClientsBaseComponent implements OnInit {

    private dietId: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute)
    }

    setup(): ComponentSetup | null {
        return {
            initialized: false
        }
    }

    ngOnInit() {
        super.ngOnInit();

        this.initDietId();
        super.subscribeToObservable(this.getMenuInitObservable());
        super.initClientSubscriptions();
    }

    private initDietId(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.dietId = +params['dietId'];
            });
    }

    private getMenuInitObservable(): Observable<any> {
        return this.clientChange.map(client => {
            this.setConfig({
                menuItems: new ClientEditDietMenuItems(client.id, this.dietId).menuItems,
                menuTitle: {
                    key: 'module.clients.viewClientSubtitle',
                    data: { 'fullName': client.getFullName() }
                },
                menuAvatarUrl: client.avatarUrl
            })
        })
    }

    private handleLoadDiet(diet: Diet): void {
        var translationData: any = {};
        translationData.dietName = diet.dietName;
        super.updateComponentTitle({ key: 'module.clients.diet.editPlanWithName', data: translationData });
    }
}