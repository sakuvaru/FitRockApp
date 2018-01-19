import { OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AuthenticatedUser, LanguageConfig } from 'app/core';
import { ErrorReasonEnum, ErrorResponse } from 'lib/repository';
import { Observable, Subject } from 'rxjs/Rx';

import { AppConfig, UrlConfig } from '../../config';
import { ComponentDependencyService } from './component-dependency.service';


export abstract class BaseComponent implements OnInit, OnDestroy {

    /**
     * Important - used to unsubsribe ALL subscriptions when component is destroyed. This ensures that requests are cancelled
     * when navigating away from the component. 
     * Solution should be official - taken from https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription
     * Usage: use 'takeUntil(this.ngUnsubscribe)' for all subscriptions.
     * Example: this.myThingService.getThings()
     *       .takeUntil(this.ngUnsubscribe)
      *      .subscribe(things => console.log(things));
     */
    protected ngUnsubscribe: Subject<void> = new Subject<void>();

    /**
    * Current language
    */
    protected currentLanguage?: LanguageConfig;

    /**
     * Current user
     */
    protected authUser?: AuthenticatedUser;

    /**
    * Indicates if component subscribed to repository errors
    */
    protected subscribedToRepositoryErrors: boolean = false;

    protected translations = {
        dialogErrorTitle: '',
        dialogDefaultError: '',
        dialogCloseButton: '',
        dialogDynamicTranslationMessage: '',
        dialogDynamicTranslationTitle: ''
    };

    constructor(protected dependencies: ComponentDependencyService, options?: {
        subscribedToRepositoryErrors?: boolean
    }) {
        if (options) {
            Object.assign(this, options);
        }
    }

    // ----------------------- Lifecycle Events --------------------- // 

    /**
     * If a child component implements its own ngOnInit, it needs to call 'super.ngOnInit' as otherwise
     * this method will not be called.
     */
    ngOnInit(): void {
        // init current language
        this.currentLanguage = this.dependencies.coreServices.currentLanguageService.getLanguage();

        // init auth user
        this.authUser = this.dependencies.authenticatedUserService.getUser();

        // stop loaders on component init 
        this.dependencies.coreServices.sharedService.setGlobalLoader(false, false);
    }

    /**
     * If a child component implements its own ngOnDestory, it needs to call 'super.ngOnDestroy' as otherwise
     * this method will not be called.
     */
    ngOnDestroy(): void {
        // ng unsubscribe as per recommendation
        // see comments on top
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    // ------------------- Loader ---------------------------- //

    startGlobalLoader(): void {
        this.dependencies.coreServices.sharedService.setGlobalLoader(true, false);
    }

    stopGlobalLoader(forceDisable: boolean = false): void {
        this.dependencies.coreServices.sharedService.setGlobalLoader(false, forceDisable);
    }

    stopAllLoaders(forceDisable: boolean = false): void {
        this.stopGlobalLoader(forceDisable);
    }

    /**
     * Uses redirect through redirect component to force refresh a component
     * @param url Url to redirect
     */
    forceRefresh(url: string): void {
        const redirectHandlerUrl = this.getAppUrl(UrlConfig.Redirect);
        this.dependencies.coreServices.navigateService.navigate(
            [redirectHandlerUrl],
            {
                queryParams: {
                    'url': url
                },
                queryParamsHandling: 'merge'
            });
    }

    navigate(commands: any[], extras?: NavigationExtras): void {
        this.dependencies.coreServices.navigateService.navigate(commands, extras);
    }

    getClientUrl(action?: string): string {
        return '/' + UrlConfig.getClientUrl(action);
    }

    getAppUrl(action: string): string {
        return '/' + UrlConfig.getActionUrl(action);
    }

    getAuthUrl(action?: string): string {
        return '/' + UrlConfig.getAuthUrl(action);
    }

    getTrainerUrl(action?: string): string {
        return '/' + UrlConfig.getTrainerUrl(action);
    }

    translate(key: string, data?: any): Observable<string> {
        return this.dependencies.coreServices.localizationService.get(key, data);
    }

    formatDate(date: Date): string {
        return this.dependencies.coreServices.timeService.formatDate(date);
    }

    fromNow(date: Date): string {
        return this.dependencies.coreServices.timeService.fromNow(date);
    }

    // --------------------- Error handlers -------------- // 

    protected handleSubscribeError(error: any): void {
        this.handleAppError(error);
    }

    protected handleAppError(error: any): void {
        // force stop all loaders
        this.stopAllLoaders(true);

        if (AppConfig.DevModeEnabled) {
            // log errors to console in dev mode
            console.error(error);
        }

        if (error instanceof ErrorResponse) {
            // don't do anything if its form error as these error should be handled by individual components
            if (error.reason === ErrorReasonEnum.FormError) {
                return;
            }

            // don't handle auth exception as they are handled by register form directly
            if (error.reason === ErrorReasonEnum.AuthException) {
                return;
            }

            // handle server not running error
            if (error.reason === ErrorReasonEnum.ServerNotRunning) {
                this.dependencies.coreServices.navigateService.serverDownPage().navigate();
                return;
            }

            // handle not found error
            if (error.reason === ErrorReasonEnum.NotFound) {
                this.dependencies.coreServices.navigateService.item404().navigate();
                return;
            }

            // handle situation where user was logged out (e.g. due to long inactivity)
            if (error.reason === ErrorReasonEnum.NotAuthorized) {
                this.dependencies.coreServices.navigateService.loginPage().navigate();
                return;
            }

            // handle license error
            if (error.reason === ErrorReasonEnum.LicenseLimitation) {
                this.showErrorDialog('errors.invalidLicense');
                return;
            }
            // handle unknown ErrorResponse error
            this.showErrorDialog();
        } else {
            // handle unknown error
            this.showErrorDialog();
        }
    }

    // --------------- Dialogs ------------------- //

    showErrorDialog(key?: string): void {
        const useKey = !key ? 'errors.dialogDefaultError' : key;
        const titleKey = 'errors.dialogErrorTitle';

        this.showDialog(useKey, titleKey);
    }

    showDialog(messageKey: string, titleKey?: string): void {
        // reset current translations
        this.translations.dialogDynamicTranslationMessage = '';
        this.translations.dialogDynamicTranslationTitle = '';

        const observables: Observable<any>[] = [];

        observables.push(this.translate(messageKey).map(text => this.translations.dialogDynamicTranslationMessage = text));

        if (titleKey) {
            observables.push(this.translate(titleKey).map(text => this.translations.dialogDynamicTranslationTitle = text));
        }

        if (!this.translations.dialogCloseButton) {
            observables.push(this.translate('shared.close').map(text => this.translations.dialogCloseButton = text));
        }

        const zippedObservable = this.dependencies.helpers.observableHelper.zipObservables(observables)
            .map(() => {
                this.dependencies.tdServices.dialogService.openAlert({
                    message: this.translations.dialogDynamicTranslationMessage,
                    title: this.translations.dialogDynamicTranslationTitle,
                    closeButton: this.translations.dialogCloseButton
                });
            });

        zippedObservable.takeUntil(this.ngUnsubscribe).subscribe();
    }

    /**
     * Error that could not be handled in any other way
     * @param error Error
     */
    protected handleFatalError(error: any): void {
        console.error('Fatal error:');
        console.error(error);
    }
}
