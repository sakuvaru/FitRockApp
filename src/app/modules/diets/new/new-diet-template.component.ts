// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { DataFormConfig } from '../../../../web-components/data-form';
import { NewDietMenuItems } from '../menu.items';
import { Diet } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'new-diet-template.component.html'
})
export class NewDietTemplateComponent extends BasePageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected componentDependencyService: ComponentDependencyService) {
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

        this.setConfig({
            componentTitle: { key: 'module.diets.submenu.new' },
            menuItems: new NewDietMenuItems().menuItems
        });

        this.initForm();
    }

    private initForm(): void {
        this.formConfig = this.dependencies.itemServices.dietService.buildInsertForm()
            .onAfterInsert((response) => this.navigate([this.getTrainerUrl('diets/edit-plan'), response.item.id]))
            .optionLabelResolver((field, originalLabel) => {
                if (field.key === 'DietCategoryId') {
                    return super.translate('module.dietCategories.categories.' + originalLabel);
                }

                return Observable.of(originalLabel);
            })
            .build();
    }
}
