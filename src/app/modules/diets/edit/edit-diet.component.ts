// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

// required by component
import { DietMenuItems } from '../menu.items';
import { Diet } from '../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-diet.component.html'
})
export class EditDietComponent extends BaseComponent implements OnInit {

    private dietId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        }
      }

    ngOnInit() {
        super.ngOnInit();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(params => {
                this.dietId = +params['id'];
            });
    }

    private handleLoadDiet(diet: Diet): void {
        this.setConfig({
            menuItems: new DietMenuItems(diet.id).menuItems,
            menuTitle: {
                key: diet.dietName
            },
            componentTitle: {
                'key': 'module.diets.editDiet'
            },
            autoInitComponent: true
        });
    }
}