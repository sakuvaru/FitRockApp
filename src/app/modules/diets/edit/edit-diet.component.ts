import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Diet } from '../../../models';
import { DietMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-diet.component.html'
})
export class EditDietComponent extends BasePageComponent implements OnInit {

    public dietId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
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
