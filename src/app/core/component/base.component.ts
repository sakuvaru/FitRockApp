import { Component, Input, OnInit } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import { IComponent } from './icomponent.interface';
import { AppData } from '../app-data/app-data.class';
import { AppConfig } from '../config/app.config';
import { ComponentDependencyService } from './component-dependency.service';
import { Subscription } from 'rxjs/Subscription';
import { ErrorResponse, RepositoryService } from '../../../lib/repository';

@Component({
})
export abstract class BaseComponent implements IComponent, OnInit {
    // name of the full screen loader - can be anything
    private fullscreenLoaderName = "fullscreen-loader";

    // snackbar config
    private snackbarDefaultDuration = 2500;

    // subscriptions
    private loaderSubscription: Subscription;
    private repositoryErrorSubscription: Subscription;

    constructor(protected dependencies: ComponentDependencyService) {
        // init shared app Data
        this.dependencies.appDataService.setAppData(this.initAppData());

        // initialize loading
        this.dependencies.loadingService.create({
            name: this.fullscreenLoaderName,
            mode: LoadingMode.Indeterminate,
            type: LoadingType.Linear,
            color: 'primary',
        });

        // suscribe to error events
        this.repositoryErrorSubscription = dependencies.repositoryService.requestErrorChange$.subscribe(
            error => {
                this.handleRepositoryError(error);
            });
    }

    abstract initAppData(): AppData;

    // ----------------------- Events --------------------- // 

    ngOnInit(): void {
        // stop all full screen loaders on init
        this.resolveFullScreenLoader();
    }

    // --------------------- Private methods -------------- // 

    private handleRepositoryError(error: ErrorResponse) {
        // do nothing for now - possibly add logging 
    }

    // --------------- Public methods ------------------- //

    showErrorPage(errorResponse: ErrorResponse) {
        // redirect to error page
        this.dependencies.router.navigate([AppConfig.PublicPath + '/' + AppConfig.ErrorPath], { queryParams: { result: errorResponse.error } });
    }

    showSnackbar(message: string): void {
        let snackBarRef = this.dependencies.snackbarService.open(message, null, { duration: this.snackbarDefaultDuration });
    }

    showSavedSnackbar(): void {
        this.showSnackbar("Uloženo");
    }

    redirectToErrorPage(): void {
        this.dependencies.router.navigate([AppConfig.PublicPath + '/' + AppConfig.ErrorPath]);
    }

    resolveFullScreenLoader(): void {
        this.dependencies.loadingService.resolve(this.fullscreenLoaderName);
    }

    registerFullScreenLoader(): void {
        this.dependencies.loadingService.register(this.fullscreenLoaderName);
    }
}