import { Component, OnChanges, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { DataFormConfig } from '../../../../../web-components/data-form';
import { ComponentDependencyService } from '../../../../core';
import { BaseClientModuleComponent } from '../../base-client-module.component';
import { Diet } from 'app/models';

@Component({
    selector: 'mod-view-client-diet',
    templateUrl: 'view-client-diet.component.html'
})
export class ViewClientDietComponent extends BaseClientModuleComponent implements OnInit {

    @Input() dietId: number;

    @Output() loadDiet = new EventEmitter<Diet>();

    constructor(
        protected componentDependencyService: ComponentDependencyService,
    ) {
        super(componentDependencyService);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    public handleLoadDiet(diet: Diet): void {
        this.loadDiet.next(diet);
    }
    
}
