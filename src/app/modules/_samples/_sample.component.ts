// common
import { Component, Input, Output, OnInit, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentConfig, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

// required by component

@Component({
})
export class SampleComponent extends BaseComponent {
    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return null;
      }
}
