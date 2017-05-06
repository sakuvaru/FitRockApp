import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AppConfig } from '../../core/config/app.config';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import { BaseComponent } from '../base/base.component';

@Component({
    templateUrl: 'login-page.component.html'
})
export class LoginPageComponent extends BaseComponent{

    constructor(private router: Router, private authService: AuthService, private _loadingService: TdLoadingService)
    { super(_loadingService)
        // go to dashboard if user is already logged
        if (this.authService.isAuthenticated()) {
            this.router.navigate([AppConfig.ClientPath]);
        }

        this._loadingService.create({
            name: 'configFullscreenDemo',
            mode: LoadingMode.Indeterminate,
            type: LoadingType.Linear,
            color: 'accent',
        });
    }

    toggleConfigFullscreenDemo(): void {
        this.registerLoader();
    }

    handleLogin(): void {
       this.registerLoader();
    }
}