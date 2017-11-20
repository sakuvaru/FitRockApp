// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DietMenuItems } from '../menu.items';
import { Diet } from '../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-diet.component.html'
})
export class EditDietComponent extends BaseComponent implements OnInit {

    public dietId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }

    ngOnInit() {
        super.ngOnInit();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.dietId = +params['id'];
            });
    }

    public handleLoadDiet(diet: Diet): void {
        this.setConfig({
            menuItems: new DietMenuItems(diet.id).menuItems,
            menuTitle: {
                key: diet.dietName
            },
            componentTitle: {
                'key': 'module.diets.editDiet'
            },
        });
    }
}
