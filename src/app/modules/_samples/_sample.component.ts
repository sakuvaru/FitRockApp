// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, ComponentDependencyService, AppData, BaseComponent } from '../../core';

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
        return new AppData({
            subTitle: "Sample subtitle"
        });
    }
}