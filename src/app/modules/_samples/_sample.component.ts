// common
import { Component, Input, Output } from '@angular/core';
import { AppConfig } from '../../core/config/app.config';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component

@Component({
    templateUrl: 'sample.component.html'
})
export class SampleComponent extends BaseComponent {
    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    initAppData(): AppData {
        return new AppData("Sample");
    }
}