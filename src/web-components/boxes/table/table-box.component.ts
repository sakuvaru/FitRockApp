import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { observableHelper } from 'lib/utilities';
import { Observable, Subject } from 'rxjs/Rx';

import { BaseWebComponent } from '../../base-web-component.class';
import { TableBoxConfig } from './table-box.models';
import { BoxColors } from '../shared/box-colors';

@Component({
    selector: 'table-box',
    templateUrl: 'table-box.component.html'
})
export class TableBoxComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Config
     */
    @Input() config: TableBoxConfig;

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

    private initBox(): void {
        if (this.initialized || !this.config) {
            return;
        }

        this.initialized = true;
    }

}
