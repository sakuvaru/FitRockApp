import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

// directives
import { HideOnMobileDirective } from './hide-on-mobile.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        HideOnMobileDirective,
    ],
    exports: [
        HideOnMobileDirective,
    ],
})
export class DirectivesModule { }