// common
import { Component, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppConfig } from '../../core/config/app.config';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { BaseField } from '../../core/dynamic-form/base-field.class';

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