// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ProgressItemMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { ProgressItemType } from '../../../models';

@Component({
    templateUrl: 'edit-type.component.html'
})
export class EditTypeComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<ProgressItemType>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initForm();
    };

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.progressItemTypeService.editForm(+params['id'])
                    .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('progress-item-types')]))
                    .onFormLoaded(form => {
                        this.setConfig({
                            menuItems: new ProgressItemMenuItems(form.item.id).menuItems,
                            menuTitle: {
                                key: form.item.typeName
                            },
                            componentTitle: {
                                'key': 'module.progressItemTypes.edit'
                            }
                        });
                    })
                    .build();
            })
            .subscribe();
    }
}