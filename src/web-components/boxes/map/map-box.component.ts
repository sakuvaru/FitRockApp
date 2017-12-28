import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseWebComponent } from '../../base-web-component.class';
import { MapBoxConfig } from './map-box.models';

@Component({
    selector: 'map-box',
    templateUrl: 'map-box.component.html'
})
export class MapBoxComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Config
     */
    @Input() config: MapBoxConfig;

    /**
     * Indicates if list box is initialized
     */
    private initialized: boolean = false;

    /*
    * Indicates if loader is enabled 
    */
    public loaderEnabled: boolean = true;

    constructor(
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.initInfoBox();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initInfoBox();
    }

    resolveAction(obs: Observable<void>): void {
        obs
            .takeUntil(this.ngUnsubscribe)
            .subscribe();
    }

    private initInfoBox(): void {
        if (this.initialized || !this.config) {
            return;
        }

        this.initialized = true;

        // stop loaded on map init
        this.loaderEnabled = false;

        // nothing specific required, might be extended in future
    }
}
