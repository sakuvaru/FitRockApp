import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// core module
import { CoreModule } from '../../core';

// components
import { ChatComponent } from './chat.component';

// router
import { ChatRouter } from './chat.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ChatRouter
    ],
    declarations: [
        ChatComponent,
    ]
})
export class ChatModule { }