import { Component } from '@angular/core';
import { AppConfig } from '../core/config/app.config';
import { TdMediaService } from '@covalent/core';

@Component({
    templateUrl: 'admin-layout.component.html'
})
export class AdminLayoutComponent {

    private appName = AppConfig.AppName;

    constructor(private media: TdMediaService) {
    }

    ngAfterViewInit(): void {
        // broadcast to all listener observables when loading the page
        this.media.broadcast();
    }
}