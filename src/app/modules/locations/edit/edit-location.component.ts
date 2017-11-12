// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// required by component
import { LocationsEditMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Location } from '../../../models';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-location.component.html'
})
export class EditLocationComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<Location>;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
      }

    ngOnInit(): void {
        super.ngOnInit();

        this.initForm();
    }

    private initForm(): void {
        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .map((params: Params) => {
                this.formConfig = this.dependencies.itemServices.locationService.editForm(+params['id'])
                    .onAfterDelete(() => super.navigate([this.getTrainerUrl('locations')]))
                    .onFormLoaded(form => {
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
