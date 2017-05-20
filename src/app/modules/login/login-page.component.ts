// common
import { Component, Input, Output } from '@angular/core';
import { AppConfig } from '../../core/config/app.config';
import { BaseField } from '../../core/web-components/dynamic-form/base-field.class';
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
export class LoginPageComponent extends BaseComponent {

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)

        // go to dashboard if user is already logged
        if (this.dependencies.authService.isAuthenticated()) {
            this.dependencies.router.navigate([AppConfig.ClientPath]);
        }
    }

    initAppData(): AppData {
        return new AppData("Login");
    }
}