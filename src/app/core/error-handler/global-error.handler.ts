import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UrlConfig } from '../config/url.config';
import { AppConfig } from '../config/app.config';
import { Router } from '@angular/router';
import { LogService } from '../../services/';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../../../lib/auth/';
import { Log } from '../../models/';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private injector: Injector) { }

    handleError(error) {
        const logService = this.injector.get(LogService);
        const sharedService = this.injector.get(SharedService);
        const authService = this.injector.get(AuthService);
        const location = this.injector.get(LocationStrategy);

        const message = error.message ? error.message : error.toString();
        const url = location instanceof PathLocationStrategy ? location.path() : '';

        let userName: string = '';
        if (authService.isAuthenticated()) {
            const currentUser = authService.getCurrentUser();
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
                        // notify shared service about the error
                        sharedService.setError(response.item);

                        if (!AppConfig.DevModeEnabled) {
                            this.navigateToErrorPage(response.item.guid);
                        }
                    },
                    (logError) => {
                        // notify shared service about the error
                        sharedService.setError(new Log().errorMessage = logError);

                        if (!AppConfig.DevModeEnabled) {
                            // redirect only if dev mode is disabled
                            this.navigateToErrorPage();
                        }
                    });
            });
        } catch (logError) {
            // parsing error failed, log raw error message
            logService.logError(message, url, userName, error)
                .subscribe((response) => {
                    // notify shared service about the error
                    sharedService.setError(response.item);

                    if (!AppConfig.DevModeEnabled) {
                        this.navigateToErrorPage(response.item.guid);
                    }
                }, (innerError) => {
                    // notify shared service about the error
                    sharedService.setError(new Log().errorMessage = innerError);

                    if (!AppConfig.DevModeEnabled) {
                        // redirect only if dev mode is disabled
                        this.navigateToErrorPage();
                    }
                });
        }

        throw error;
    }

    private redirectToErrorPage(): void {
        window.location.href = UrlConfig.getAppErrorUrl();
    }

    private navigateToErrorPage(logGuid?: string): void {
        const router = this.injector.get(Router);
        const param = {};
        param[UrlConfig.AppErrorLogGuidQueryString] = logGuid;

        router.navigate([UrlConfig.getAppErrorUrl()], { queryParams: param });
    }
}
