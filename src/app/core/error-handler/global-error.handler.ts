import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UrlConfig } from '../config/url.config';
import { AppConfig } from '../config/app.config';
import { Router } from '@angular/router';
import { LogService } from '../../services/';
import { SharedService } from '../shared-service/shared.service';
import { AuthService } from '../../../lib/auth/';
import { Log } from '../../models/';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error) {
        console.log('Log error');
        var logService = this.injector.get(LogService);
        var sharedService = this.injector.get(SharedService);
        var authService = this.injector.get(AuthService);
        var location = this.injector.get(LocationStrategy);

        var message = error.message ? error.message : error.toString();
        var url = location instanceof PathLocationStrategy ? location.path() : '';
        var userName = authService.isAuthenticated() ? authService.getCurrentUser().email : '';

        // get the stack trace, lets grab the last 10 stacks only
        StackTrace.fromError(error).then(stackframes => {
            const stackString = stackframes
                .splice(0, 20)
                .map(function (sf) {
                    return sf.toString();
                }).join('\n');

            // log on the server
            logService.logError(message, url, userName, stackString)
                .subscribe((response) => {
                    // notify shared service about the error
                    sharedService.setError(response.item);

                    if (!AppConfig.DevModeEnabled) {
                        this.navigateToErrorPage(response.item.guid);
                    }

                },
                (error) => {
                    if (!AppConfig.DevModeEnabled) {
                        // redirect only if dev mode is disabled
                        this.navigateToErrorPage();
                    }
                });
        });

        // don't rethrow error (it will cause this handler to be called twice) - log as console error instead
        console.error(error);
    }

    private navigateToErrorPage(logGuid?: string): void {
        var router = this.injector.get(Router);
        var param = {};
        param[UrlConfig.AppErrorLogGuidQueryString] = logGuid;

        router.navigate([UrlConfig.getAppErrorUrl()], { queryParams: param });
    }
}