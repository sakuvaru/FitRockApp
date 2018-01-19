// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { ProgressItemMenuItems } from '../menu.items';
import { DataFormConfig } from '../../../../web-components/data-form';
import { ProgressItemType } from '../../../models';

@Component({
    templateUrl: 'edit-type.component.html'
})
export class EditTypeComponent extends BasePageComponent implements OnInit {

    public formConfig: DataFormConfig;

    constructor(
        protected activatedRoute: ActivatedRoute,
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

    ngOnInit(): void {
        super.ngOnInit();
        this.initForm();
    }

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.progressItemTypeService.buildEditForm(+params['id'])
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('progress-item-types')]))
                    .onEditFormLoaded(form => {
                        this.setConfig({
                            menuItems: new ProgressItemMenuItems(form.item.id).menuItems,
                            menuTitle: {
                                key: form.item.typeName
                            },
                            componentTitle: {
                                'key': 'module.progressItemTypes.submenu.edit'
                            }
                        });
                    })
                    .build();
            })
            .subscribe();
    }
}
