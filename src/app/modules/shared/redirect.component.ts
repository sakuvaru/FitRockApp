// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppConfig, ComponentDependencyService, BaseComponent } from '../../core';

/**
 * This component is used to redirect user to another component
 * Reason - sometimes component needs to be refreshed, but using 'navigate' on the same route does not
 * refresh the whole page => go through redirect router to force refresh.
 */
@Component({
    template: 'redirect.component.html'
})
export class RedirectComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        // get redirect url from 'redirect' query string
        var url = this.route.snapshot.queryParams[AppConfig.RedirectQueryString];

        if (!url) {
            throw Error(`Cannot redirect because '${AppConfig.RedirectQueryString}' query param is missing`);
        }

        // navigate to route
        this.router.navigate([url]);
    }
}