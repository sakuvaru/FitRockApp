import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseWebComponent } from '../../base-web-component.class';
import { MiniBoxConfig } from './mini-box.models';
import { BoxColors } from '../shared/box-colors';

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
        const defaultClass: string = 'mini-box-primary';

        if (!this.config) {
            return defaultClass;
        }

        if (this.config.color === BoxColors.Primary) {
            return 'mini-box-primary';
        } else if (this.config.color === BoxColors.Accent) {
            return 'mini-box-accent';
        } else if (this.config.color === BoxColors.Blue) {
            return 'mini-box-blue';
        } else if (this.config.color === BoxColors.Purple) {
            return 'mini-box-purple';
        } else if (this.config.color === BoxColors.Orange) {
            return 'mini-box-orange';
        } else if (this.config.color === BoxColors.Yellow) {
            return 'mini-box-yellow';
        } else if (this.config.color === BoxColors.Cyan) {
            return 'mini-box-cyan';
        } 

        return defaultClass;
    }

    private initBox(): void {
        if (this.initialized || !this.config) {
            return;
        }

        this.initialized = true;
    }

}
