import { Component, OnChanges } from '@angular/core';

import { ComponentDependencyService } from '../../../core';
import { BaseClientModuleComponent } from '../base-client-module.component';

@Component({
    selector: 'mod-client-chat',
    templateUrl: 'client-chat.component.html'
})
export class ClientChatComponent extends BaseClientModuleComponent  {

    constructor(
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService);

    }
}
