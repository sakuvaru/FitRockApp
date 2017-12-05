import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedWebComponentModule } from '../shared-web-components.module';
import { PluralFoodUnitsComponent } from './diet/plural-food-units.component';
import { PluralComponent } from './plural.component';

@NgModule({
    imports: [
        CommonModule,
        SharedWebComponentModule,
        RouterModule, // router needs to be importes so that routerLink can be used within components
    ],
    declarations: [
        PluralComponent,
        PluralFoodUnitsComponent
    ],
    exports: [
        PluralComponent,
        PluralFoodUnitsComponent
    ]
})
export class TextModule { }
