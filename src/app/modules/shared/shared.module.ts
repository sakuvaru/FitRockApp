import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// core module
import { CoreModule } from '../../core';

// components
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { ErrorComponent } from './error.component';

// router
import { SharedRouter } from './shared.routing';

@NgModule({
    imports: [
        CommonModule,
        SharedRouter,
        CoreModule
    ],
    declarations: [
        NotFoundComponent,
        UnauthorizedComponent,
        ErrorComponent,
    ],
    // Shared components need to be exported so that other modules can use them, as 
    // otherwise they can be used only within the same module
    exports: [
        NotFoundComponent,
        UnauthorizedComponent,
    ],
})
export class SharedModule { }