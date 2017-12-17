import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TitleDirective } from './text-manipulation/title.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        TitleDirective
    ],
    exports: [
        TitleDirective
    ],
})
export class DirectivesModule { }
