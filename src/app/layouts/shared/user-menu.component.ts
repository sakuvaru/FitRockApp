import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ComponentDependencyService, BaseComponent, MenuItemType, AppConfig } from '../../core';

@Component({
    selector: 'user-menu',
    templateUrl: 'user-menu.component.html'
})
export class UserMenuComponent extends BaseComponent implements OnInit{
    constructor(protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit() {
        super.ngOnInit();        
    }
}