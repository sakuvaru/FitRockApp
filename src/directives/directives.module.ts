import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';

// directives
import { HideOnMobileDirective } from './hide-on-mobile.directive';
import { ShowOnMobileDirective } from './show-on-mobile.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        HideOnMobileDirective,
        ShowOnMobileDirective
    ],
    exports: [
        HideOnMobileDirective,
        ShowOnMobileDirective
    ],
})
export class DirectivesModule { }
