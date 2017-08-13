// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientsBaseComponent } from '../../clients-base.component';
import { ClientEditDietMenuItems } from '../../menu.items';
import { Diet } from '../../../../models';
import 'rxjs/add/operator/switchMap';

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

    ngOnInit() {
        super.ngOnInit();

        this.initDietId();
        super.initClientSubscriptions();
    }

    private initDietId(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.dietId = +params['dietId'];
            });
    }

    private handleLoadDiet(diet: Diet): void {
        this.setConfig({
            menuItems: new ClientEditDietMenuItems(this.clientId, this.dietId).menuItems,
            menuTitle: {
                key: diet.dietName
            },
            componentTitle: {
                key: 'module.clients.diet.editDiet'
            }
        });
    }
}