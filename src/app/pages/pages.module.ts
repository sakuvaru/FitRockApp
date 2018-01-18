import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatModule } from './chat/chat.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChatModule
    ]
})
export class PagesModule { }
