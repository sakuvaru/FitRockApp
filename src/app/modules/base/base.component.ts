import { Component, Input, OnInit } from '@angular/core';
import { TdLoadingService, LoadingMode, LoadingType } from '@covalent/core';

@Component({
})
export abstract class BaseComponent implements OnInit {
    constructor(protected loadingService: TdLoadingService) {

        // initialize loading
        this.loadingService.create({
            name: 'fullscreen-loader',
            mode: LoadingMode.Indeterminate,
            type: LoadingType.Linear,
            color: 'primary',
        });
    }

    ngOnInit(): void {
        // stop all loaders on init
        this.loadingService.resolve('fullscreen-loader');

    }

    protected registerLoader(): void {
        this.loadingService.register('fullscreen-loader');
    }
}