import { Component, Input } from '@angular/core';

import { ComponentDependencyService } from '../../core';
import { AppConfig } from 'app/config';

@Component({
    selector: 'footer',
    templateUrl: 'footer.component.html'
})
export class FooterComponent {
    @Input() appName: string;

    public year: number;
    public version: string = AppConfig.Version;

    constructor(private dependencies: ComponentDependencyService) {
        const date = new Date();
        this.year = date.getFullYear();
    }
}
