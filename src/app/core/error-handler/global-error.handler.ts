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
        console.log('Error handler');
        var logService = this.injector.get(LogService);
        var sharedService = this.injector.get(SharedService);
        var authService = this.injector.get(AuthService);
        var location = this.injector.get(LocationStrategy);

        var message = error.message ? error.message : error.toString();
        var url = location instanceof PathLocationStrategy ? location.path() : '';

        var userName: string = '';
        if (authService.isAuthenticated()){
            var currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.email){
                userName = currentUser.email
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
                    (error) => {
                        // notify shared service about the error
                        sharedService.setError(new Log().errorMessage = error);

                        if (!AppConfig.DevModeEnabled) {
                            // redirect only if dev mode is disabled
                            this.navigateToErrorPage();
                        }
                    });
            });
        }
        catch (error) {
            // parsing error failed, log raw error message
            logService.logError(message, url, userName, error)
                .subscribe((response) => {
                    // notify shared service about the error
                    sharedService.setError(response.item);

                    if (!AppConfig.DevModeEnabled) {
                        this.navigateToErrorPage(response.item.guid);
                    }
                },
                (error) => {
                    // notify shared service about the error
                    sharedService.setError(new Log().errorMessage = error);

                    if (!AppConfig.DevModeEnabled) {
                        // redirect only if dev mode is disabled
                        this.navigateToErrorPage();
                    }
                });
        }

        throw error;
        //console.error(error);
    }

    private redirectToErrorPage(): void {
        window.location.href = UrlConfig.getAppErrorUrl();
    }

    private navigateToErrorPage(logGuid?: string): void {
        var router = this.injector.get(Router);
        var param = {};
        param[UrlConfig.AppErrorLogGuidQueryString] = logGuid;

        router.navigate([UrlConfig.getAppErrorUrl()], { queryParams: param });
    }
}