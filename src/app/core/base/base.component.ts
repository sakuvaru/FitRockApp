import { Component, Input, OnInit } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import { IComponent } from './icomponent.interface';
import { AppDataService } from '../../core/app-data.service';
import { AppData } from '../app-data.class';
import { AppConfig } from '../config/app.config';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { Subscription } from 'rxjs/Subscription';
import { RepositoryService } from '../../repository/repository.service';
import { ErrorResponse } from '../../repository/error-response.class';
import { ResponseTypeEnum } from '../../repository/response-type.enum';
import { MdSnackBar } from '@angular/material';

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

        // subscribe to loading events
        this.loaderSubscription = dependencies.repositoryService.requestStateChanged$.subscribe(
            requestFinished => {
                this.showLoader(requestFinished);
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
        // stop all loaders on init
       this.resolveLoader();
    }

    // --------------------- Private methods -------------- // 

    private showLoader(isEnabled: boolean): void {
        if (isEnabled) {
          //  this.registerLoader();
        }
        else {
          //  this.resolveLoader();
        }
    }

    private handleRepositoryError(error: ErrorResponse) {
        if (error.statusType === ResponseTypeEnum.internalServerError ||
            error.statusType === ResponseTypeEnum.unknown ||
            error.statusType === ResponseTypeEnum.badRequest ||
            error.statusType === ResponseTypeEnum.forbidden) {
            // redirect to error page
            this.dependencies.router.navigate([AppConfig.PublicPath + '/' + AppConfig.ErrorPath], { queryParams: { result: error.statusType } });
        }
    }

    // --------------- Public methods ------------------- //

    showSnackbar(message: string): void {
        let snackBarRef = this.dependencies.snackbarService.open(message, null, { duration: this.snackbarDefaultDuration });
    }

    showSavedSnackbar(): void {
        this.showSnackbar("Uloženo");
    }

    redirectToErrorPage(): void {
        this.dependencies.router.navigate([AppConfig.PublicPath + '/' + AppConfig.ErrorPath]);
    }

    resolveLoader(): void {
        this.dependencies.loadingService.resolve(this.fullscreenLoaderName);
    }

    registerLoader(): void {
        this.dependencies.loadingService.register(this.fullscreenLoaderName);
    }
}