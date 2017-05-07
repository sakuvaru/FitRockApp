import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// components
import { SampleComponent } from './_sample.component';

// router
import { SampleRouter } from './_sample.routing';

// Covalent modules for Angular2
import { CovalentCoreModule } from '@covalent/core';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, // router module needs to be exported along with the layouts so that router-outlet can be used
        CovalentCoreModule, // covalent needs to be imported here as well because templates are using its modules
        SampleRouter,
    ],
    declarations: [
        SampleComponent,
    ]
})
export class SampleModule { }