// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ComponentDependencyService, BasePageComponent, ComponentSetup } from '../../core';
import { AppConfig } from '../../config';

/**
 * This component is used to redirect user to another component
 * Reason - sometimes component needs to be refreshed, but using 'navigate' on the same route does not
 * refresh the whole page => go through redirect router to force refresh.
 */
@Component({
    template: 'redirect.component.html'
})
export class RedirectComponent extends BasePageComponent implements OnInit {

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit() {
        super.ngOnInit();

        // get redirect url from 'redirect' query string
        const url = this.activatedRoute.snapshot.queryParams[AppConfig.RedirectQueryString];

        if (!url) {
            throw Error(`Cannot redirect because '${AppConfig.RedirectQueryString}' query param is missing`);
        }

        // navigate to route
        this.navigate([url]);
    }
}
