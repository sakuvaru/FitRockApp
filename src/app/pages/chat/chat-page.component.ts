import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/models';
import { ResponseMultiple } from 'lib/repository';
import { Subject } from 'rxjs/Rx';

import { BasePageComponent, ComponentDependencyService, ComponentSetup } from '../../core';
import { ChatMenuItems } from './menu.items';

@Component({
    templateUrl: 'chat-page.component.html'
})
export class ChatPageComponent extends BasePageComponent implements OnInit {

    public conversationUserId?: number;

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected componentDependencyService: ComponentDependencyService
    ) {
        super(componentDependencyService, activatedRoute);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    configureMenuItems(response: ResponseMultiple<User>): void {
        this.setConfig({
            menuItems: new ChatMenuItems(response.items).menuItems,
            enableSearch: true
        });
    }

    changeComponentTitle(user: User): void {
        // update component config with user's name
        super.setConfig({
            componentTitle: { key: user.getFullName() }
        });
    }

    private init(): void {
        super.subscribeToObservable(this.activatedRoute.params
            .map(params => {
                this.conversationUserId = +params['id'];
            })
        );
    }
}
