import { Component, Input, OnDestroy } from '@angular/core';
import { TdMediaService } from '@covalent/core';

import { AppConfig, AppData, ComponentDependencyService } from '../../core';

@Component({
    selector: 'footer',
    templateUrl: 'footer.component.html'
})
export class FooterComponent{
    private appData: AppData = new AppData();
    private year: number;

    constructor(private dependencies: ComponentDependencyService) {
        var date = new Date();
        this.year = date.getFullYear();
    }
}