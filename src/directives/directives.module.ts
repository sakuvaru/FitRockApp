import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ResponsiveDirective } from './responsive.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        ResponsiveDirective
    ],
    exports: [
        ResponsiveDirective
    ],
})
export class DirectivesModule { }