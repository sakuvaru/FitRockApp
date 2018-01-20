import { Component, OnInit } from '@angular/core';

import { DataFormConfig } from '../../../../web-components/data-form';
import { BasePageComponent, ComponentDependencyService } from '../../../core';
import { NewDietMenuItems } from '../menu.items';

@Component({
    templateUrl: 'new-diet-template-page.component.html'
})
export class NewDietTemplatePageComponent extends BasePageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.diets.submenu.new' },
            menuItems: new NewDietMenuItems().menuItems
        });
    }
}
