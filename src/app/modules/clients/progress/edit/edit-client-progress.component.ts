// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../../../core';

// required by component
import { ClientOverviewMenuItems } from '../../menu.items';
import { FormConfig } from '../../../../../web-components/dynamic-form';
import { ProgressItem } from '../../../../models';
import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'edit-client-progress.component.html'
})
export class EditClientProgressComponent extends BaseComponent implements OnInit {

    private formConfig: FormConfig<ProgressItem>;
    private clientId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService)
    }

    ngOnInit(): void {
        super.ngOnInit();

        super.startLoader();

        this.activatedRoute.params
            .takeUntil(this.ngUnsubscribe)
            .switchMap((params: Params) => {
                this.clientId = +params['id'];
                return this.dependencies.itemServices.progressItemService.insertForm()
            })
            .subscribe(form => {
                // set clientId manually
                form.withFieldValue('ClientId', this.clientId);

                form.onFormLoaded(() => super.stopLoader());
                form.onBeforeSave(() => super.startGlobalLoader());
                form.onAfterSave(() => super.stopGlobalLoader());
                form.onError(() => super.stopGlobalLoader());

                this.setConfig({
                    componentTitle: { key: 'module.clients.progress.newProgressItem' },
                    menuItems: new ClientOverviewMenuItems().menuItems
                });

                // get form
                this.formConfig = form.build();
            },
            error => super.handleError(error));
    }
}