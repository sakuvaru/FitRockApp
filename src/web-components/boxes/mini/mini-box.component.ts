import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseWebComponent } from '../../base-web-component.class';
import { MiniBoxConfig } from './mini-box.models';
import { BoxColors } from '../shared/box-colors';
import { boxHelper } from '../shared/box-helper';

@Component({
    selector: 'mini-box',
    templateUrl: 'mini-box.component.html'
})
export class MiniBoxComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Config
     */
    @Input() config: MiniBoxConfig;

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
