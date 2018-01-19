import { Input, OnDestroy, OnInit } from '@angular/core';

import { BaseModuleComponent, ComponentDependencyService } from '../../core';
import { User } from '../../models';

export abstract class BaseClientModuleComponent extends BaseModuleComponent implements OnInit, OnDestroy {

    @Input() client: User;

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}

