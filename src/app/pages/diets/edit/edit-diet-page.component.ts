import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Diet } from '../../../models';
import { DietMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-diet-page.component.html'
})
export class EditDietPageComponent extends BasePageComponent implements OnInit {

    public dietId?: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit() {
        super.ngOnInit();

        super.subscribeToObservable(
            this.activatedRoute.params.map(params => {
                this.dietId = +params['id'];
            })
        );
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
