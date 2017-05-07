import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';

// router
import { SharedRouter } from './shared.routing';

@NgModule({
    imports: [
        CommonModule,
        SharedRouter,
    ],
    declarations: [
        NotFoundComponent,
        UnauthorizedComponent
    ],
    // Shared components need to be exported so that other modules can use them, as 
    // otherwise they can be used only within the same module
    exports: [
        NotFoundComponent,
        UnauthorizedComponent
    ],
})
export class SharedModule { }