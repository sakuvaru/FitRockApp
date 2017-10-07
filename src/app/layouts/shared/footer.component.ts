import { Component, Input, OnDestroy } from '@angular/core';
import { TdMediaService } from '@covalent/core';

import { AppConfig, ComponentDependencyService } from '../../core';

@Component({
    selector: 'footer',
    templateUrl: 'footer.component.html'
})
export class FooterComponent {
    @Input() appName: string;

    private year: number;

    constructor(private dependencies: ComponentDependencyService) {
        let date = new Date();
        this.year = date.getFullYear();
    }
}