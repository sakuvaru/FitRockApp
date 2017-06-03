import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// core module
import { CoreModule } from '../../core';

// components
import { SampleComponent } from './_sample.component';

// router
import { SampleRouter } from './_sample.routing';


@NgModule({
    imports: [
        CommonModule,
        CoreModule, 
        SampleRouter,
    ],
    declarations: [
        SampleComponent,
    ]
})
export class SampleModule { }