import { Component, Input, OnInit } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';
import { IComponent } from './icomponent.interface';
import { AppDataService } from '../../core/app-data.service';
import { AppData } from '../app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

@Component({
})
export abstract class BaseComponent implements IComponent, OnInit {
    // name of the full screen loader - can be anything
    private fullscreenLoaderName = "fullscreen-loader";

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
    }

    abstract initAppData(): AppData;
    
    ngOnInit(): void {
        // stop all loaders on init
        this.dependencies.loadingService.resolve(this.fullscreenLoaderName);

    }

    registerLoader(): void {
        this.dependencies.loadingService.register(this.fullscreenLoaderName);
    }
}