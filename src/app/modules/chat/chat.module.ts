import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '../../core';
import { ChatComponent } from './chat.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
    ],
    declarations: [
        ChatComponent,
    ],
    exports: [
        ChatComponent
    ]
})
export class ChatModule { }
