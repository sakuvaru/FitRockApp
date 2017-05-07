import { Component, Input, OnInit } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import { IComponent } from './icomponent.interface';
import { AppDataService } from '../../core/app-data.service';
import { AppData } from '../app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';
import { Subscription } from 'rxjs/Subscription';
import { RepositoryService } from '../../repository/repository.service';

@Component({
})
export abstract class BaseComponent implements IComponent, OnInit {
    // name of the full screen loader - can be anything
    private fullscreenLoaderName = "fullscreen-loader";
    private loaderSubscription: Subscription;

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
    }

    abstract initAppData(): AppData;

    private showLoader(isEnabled: boolean): void{
        if (isEnabled){
            this.registerLoader();
        }
        else{
            this.resolveLoader();
        }
    }

    ngOnInit(): void {
        // stop all loaders on init
        this.resolveLoader();
    }

    resolveLoader(): void{
        this.dependencies.loadingService.resolve(this.fullscreenLoaderName);
    }

    registerLoader(): void {
        this.dependencies.loadingService.register(this.fullscreenLoaderName);
    }
}