// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientEditDietMenuItems } from '../../menu.items';
import { Diet } from '../../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-client-diet.component.html'
})
export class EditClientDietComponent extends BaseComponent implements OnInit {

    private clientId: number;
    private dietId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit() {
        super.ngOnInit();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.dietId = +params['dietId'];
                this.clientId = +params['id'];
            });
    }

    private handleLoadDiet(diet: Diet): void {
        this.setConfig({
            menuItems: new ClientEditDietMenuItems(this.clientId, this.dietId).menuItems,
            menuTitle: {
                key: 'module.clients.diet.editDiet'
            },
            componentTitle: {
                key: diet.dietName
            }
        });
    }
}