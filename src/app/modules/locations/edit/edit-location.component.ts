// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { LocationsEditMenuItems } from '../menu.items';
import { DataFormConfig } from '../../../../web-components/data-form';
import { Location } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-location.component.html'
})
export class EditLocationComponent extends BaseComponent implements OnInit {

    public formConfig: DataFormConfig;

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

    ngOnInit(): void {
        super.ngOnInit();

        this.initForm();
    }

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.locationService.buildEditForm(+params['id'])
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('locations')]))
                    .onEditFormLoaded(form => {
                        this.setConfig({
                            menuItems: new LocationsEditMenuItems(form.item.id).menuItems,
                            menuTitle: {
                                key: form.item.locationName
                            },
                            componentTitle: {
                                'key': 'module.locations.submenu.edit'
                            }
                        });
                    })
                    .optionLabelResolver((field, optionLabel) => {
                        if (field.key === 'LocationType') {
                            return super.translate('module.locations.type.' + optionLabel);
                        }
                        return Observable.of(optionLabel);
                    })
                    .build();
            })
            .subscribe();
    }
}
