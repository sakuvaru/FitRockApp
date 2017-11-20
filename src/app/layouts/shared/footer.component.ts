import { Component, Input, OnDestroy } from '@angular/core';
import { TdMediaService } from '@covalent/core';

import { ComponentDependencyService } from '../../core';

@Component({
    selector: 'footer',
    templateUrl: 'footer.component.html'
})
export class FooterComponent {
    @Input() appName: string;

    public year: number;

    constructor(private dependencies: ComponentDependencyService) {
        const date = new Date();
        this.year = date.getFullYear();
    }
}
