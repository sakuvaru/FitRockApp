import { Component, Input, OnDestroy } from '@angular/core';
import { AppConfig } from '../../core/config/app.config';
import { TdMediaService } from '@covalent/core';
import { AppDataService } from '../../core/app-data.service';
import { Subscription } from 'rxjs/Subscription';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

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