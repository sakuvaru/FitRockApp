// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { Observable } from 'rxjs/Rx';

@Component({
    templateUrl: 'edit-avatar.component.html'
})
export class EditAvatarComponent extends BaseComponent implements OnInit {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit() {
        super.ngOnInit();

        this.initMenu();
    }

    private initMenu(): void{
        
        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.avatar' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }

}