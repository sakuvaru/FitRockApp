import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { ProgressItemType } from '../../../models';
import { ProgressItemMenuItems } from '../menu.items';

@Component({
    templateUrl: 'edit-progress-type-page.component.html'
})
export class EditProgressTypePageComponent extends BasePageComponent implements OnInit {

    public progressTypeId?: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.subscribeToObservable(
            this.activatedRoute.params.map(params => {
                this.progressTypeId = +params['id'];
            })
        );
    }

    handleLoadProgressType(type: ProgressItemType): void {
        this.setConfig({
            menuItems: new ProgressItemMenuItems(type.id).menuItems,
            menuTitle: {
                key: type.typeName
            },
            componentTitle: {
                'key': 'module.progressItemTypes.submenu.edit'
            }
        });
    }
}
