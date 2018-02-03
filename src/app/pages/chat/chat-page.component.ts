import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/models';
import { ResponseMultiple } from 'lib/repository';

import { BasePageComponent, ComponentDependencyService, RightMenu } from '../../core';
import { ChatMenuItems, ChatSelectedUserItems } from './menu.items';

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
            rightMenu: new RightMenu(new ChatMenuItems(response.items).menuItems, super.translate('module.chat.contacts')),
            enableSearch: true
        });
    }

    changeComponentTitle(user: User): void {
        // update component config with user's name
        super.setConfig({
            menuTitle: { key: 'module.chat.submenu.title'},
            componentTitle: { key: user.getFullName() },
            menuItems: new ChatSelectedUserItems(user).menuItems
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
