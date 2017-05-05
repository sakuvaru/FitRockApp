import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedRouter } from './shared.routing';

// main components
import { HeaderComponent } from './header.component';
import { FooterComponent } from './/footer.component';
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedRouter,
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        NotFoundComponent,
        UnauthorizedComponent
    ],
    // Shared components need to be exported, otherwise they can be used only within the same module
    exports: [
        HeaderComponent,
        FooterComponent,
        NotFoundComponent,
        UnauthorizedComponent
    ],
})
export class SharedModule { }