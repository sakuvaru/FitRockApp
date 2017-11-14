// common
import { Component, Input, OnDestroy, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { ComponentDependencyService, BaseComponent, MenuItemType, ComponentSetup } from '../core';
import { AppConfig, UrlConfig } from '../config';

// required by component
import { BaseLayoutComponent } from './base/base-layout.component';
import { stringHelper } from '../../lib/utilities';
import { GlobalLoaderStatus } from '../core';
import { FormControl } from '@angular/forms';

@Component({
    templateUrl: 'simple-layout.component.html'
})
export class SimpleLayoutComponent extends BaseLayoutComponent {

    constructor(
        protected dependencies: ComponentDependencyService,
        protected cdr: ChangeDetectorRef,
    ) {
        super(dependencies);
    }
}
