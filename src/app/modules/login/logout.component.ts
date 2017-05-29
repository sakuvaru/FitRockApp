// common
import { Component, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppConfig } from '../../core/config/app.config';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { DataTableField } from '../../core/web-components/data-table/data-table-field.class';
import { DataTableConfig } from '../../core/web-components/data-table/data-table.config';
import { AlignEnum } from '../../core/web-components/data-table/align-enum';

// required by component
import { RouterModule, Router } from '@angular/router';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LogoutComponent extends BaseComponent {

    constructor(
        private router: Router,
        protected dependencies: ComponentDependencyService) {
        super(dependencies)

        // logout user
        this.dependencies.authService.logout();

        // redirect after logging-out
        this.router.navigate([AppConfig.PublicPath + '/' + AppConfig.RedirectAfterLogoutPath]);
    }

    initAppData(): AppData {
        return new AppData();
    }
}