// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

// required by component
import { BaseField, FormConfig } from '../../../lib/web-components';
import { User } from '../../models';
import { UserFormsService} from '../../forms';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends BaseComponent {

    private error: string;
    private formConfig: FormConfig<any>;

    constructor(
        private userFormsService: UserFormsService,
        protected componentDependencyService: ComponentDependencyService) {
        super(componentDependencyService)

        this.formConfig = this.userFormsService.getInsertForm({
            saveFunction: (item) => this.dependencies.userService.createClient(item),
            insertCallback: (response) => {
                // redirect to view client page
                this.dependencies.router.navigate([this.getTrainerUrl('clients/view'), response.item.id]);
            },
            errorCallback: (err) => {
                console.log("This is error callback: " + err);
            }
        });
    }

    initAppData(): AppData {
        return new AppData({
            subTitle: "Nový klient"
        });
    }
}