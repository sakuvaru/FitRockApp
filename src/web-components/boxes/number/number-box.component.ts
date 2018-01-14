import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { BaseWebComponent } from '../../base-web-component.class';
import { boxHelper } from '../shared/box-helper';
import { NumberBoxConfig } from './number-box.models';

@Component({
    selector: 'number-box',
    templateUrl: 'number-box.component.html'
})
export class NumberBoxComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Config
     */
    @Input() config: NumberBoxConfig;

    private initialized: boolean = false;

    constructor(
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.initBox();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initBox();
    }

    getClassName(): string {
        return boxHelper.getClassName(this.config.color);
    }

    private initBox(): void {
        if (this.initialized || !this.config) {
            return;
        }

        this.initialized = true;
    }

}
