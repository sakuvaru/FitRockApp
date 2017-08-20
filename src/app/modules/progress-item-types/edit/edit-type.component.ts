// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// required by component
import { ProgressItemMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { ProgressItemType } from '../../../models';
import 'rxjs/add/operator/switchMap';

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

    private initForm(): void{
        super.startLoader();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => {
                return this.dependencies.itemServices.progressItemTypeService.editForm(+params['id'])
                    .takeUntil(this.ngUnsubscribe);
            })
            .subscribe(form => {
                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());
                form.onAfterDelete(() => super.navigate([this.getTrainerUrl('progress-item-types')]));
                var item = form.getItem();

                this.setConfig({
                    menuItems: new ProgressItemMenuItems(item.id).menuItems,
                    menuTitle: {
                        key: item.typeName
                    },
                    componentTitle: {
                        'key': 'module.progressItemTypes.edit'
                    }
                });

                // get form
                this.formConfig = form.build();
            }
            ,
            error => super.handleError(error));
    }
}