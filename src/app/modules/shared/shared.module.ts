import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// core module
import { CoreModule } from '../../core';

// components
import { Item404Component } from './item-404.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { AppErrorComponent } from './app-error.component';
import { RedirectComponent } from './redirect.component';

// router
import { SharedRouter } from './shared.routing';

@NgModule({
    imports: [
        CommonModule,
        SharedRouter,
        CoreModule,
    ],
    declarations: [
        UnauthorizedComponent,
        RedirectComponent,
        Item404Component,
        AppErrorComponent
    ],
    // Shared components need to be exported so that other modules can use them, as 
    // otherwise they can be used only within the same module
    exports: [
        UnauthorizedComponent,
        RedirectComponent,
        Item404Component,
        AppErrorComponent
    ],
})
export class SharedModule { }
