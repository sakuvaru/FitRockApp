import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'lib/auth/';
import * as StackTrace from 'stacktrace-js';

import { AppConfig, UrlConfig } from '../../config';
import { Log } from '../../models';
import { LogService } from '../../services';
import { SharedService } from '../services/shared.service';
import { NavigateService } from 'app/core/services';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    /**
    * The handlerError is called twice for some reason. This property should
    * be used to ensure that only 1 log is logged in database.
    */
    private errorProcessing: boolean = false;

    constructor(private injector: Injector) { }

    handleError(error) {
        if (this.errorProcessing) {
            // don't handle error as other error is currently processing
            return;
        }
        this.errorProcessing = true;

        const logService = this.injector.get(LogService);
        const sharedService = this.injector.get(SharedService);
        const authService = this.injector.get(AuthService);
        const location = this.injector.get(LocationStrategy);

        const message = error.message ? error.message : error.toString();
        const url = location instanceof PathLocationStrategy ? location.path() : '';

        let userName: string = '';
        if (authService.isAuthenticated()) {
            const currentUser = authService.getAuth0UserFromLocalStorage();
            if (currentUser && currentUser.email) {
                userName = currentUser.email;
            }
        }

        try {
            // get the stack trace, lets grab the last 
            StackTrace.fromError(error).then(stackframes => {
                const stackString = stackframes
                    .splice(0, 50)
                    .map(function (sf) {
                        return sf.toString();
                    }).join('\n');

                // log on the server
                logService.logError(message, url, userName, stackString)
                    .subscribe((response) => {
                        this.errorProcessing = false;

                        // notify shared service about the error
                        sharedService.setError(response.item);

                        if (AppConfig.RedirectToErrorPageOnError) {
                            this.navigateToErrorPage(response.item.guid);
                        }
                    },
                    (logError) => {
                        this.errorProcessing = false;

                        // notify shared service about the error
                        sharedService.setError(new Log().errorMessage = logError);

                        if (AppConfig.RedirectToErrorPageOnError) {
                            // redirect only if dev mode is disabled
                            this.navigateToErrorPage();
                        }
                    })
                    ;
            });
        } catch (logError) {
            // parsing error failed, log raw error message
            logService.logError(message, url, userName, error)
                .subscribe((response) => {
                    this.errorProcessing = false;

                    // notify shared service about the error
                    sharedService.setError(response.item);

                    if (AppConfig.RedirectToErrorPageOnError) {
                        this.navigateToErrorPage(response.item.guid);
                    }
                }, (innerError) => {
                    this.errorProcessing = false;

                    // notify shared service about the error
                    sharedService.setError(new Log().errorMessage = innerError);

                    if (AppConfig.RedirectToErrorPageOnError) {
                        // redirect only if dev mode is disabled
                        this.navigateToErrorPage();
                    }
                });
        }

        // if the 'throw error' is used, the application will become unresponsive and the handle error would be called twice.
        // just log the error to console.
        console.error(error);
        // throw error;
    }

    private redirectToErrorPage(): void {
        window.location.href = UrlConfig.getErrorUrl();
    }

    private navigateToErrorPage(logGuid?: string): void {
        const navigateService = this.injector.get(NavigateService);

        const params = {};
        params[UrlConfig.AppErrorLogGuidQueryString] = logGuid;

        navigateService.errorPage({
            queryParams: params
        }).navigate();
    }
}
