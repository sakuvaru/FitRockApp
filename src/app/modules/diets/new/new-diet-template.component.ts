// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { FormConfig } from '../../../../web-components/dynamic-form';
import { NewDietMenuItems } from '../menu.items';
import { Diet } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-diet-template.component.html'
})
export class NewDietTemplateComponent extends BaseComponent implements OnInit {

    public formConfig: FormConfig<Diet>;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }

    ngOnInit() {
        super.ngOnInit();

        this.setConfig({
            componentTitle: { key: 'module.diets.submenu.new' },
            menuItems: new NewDietMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.dietService.insertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('diets/edit-plan'), response.item.id]))
            .build();
    }
}
