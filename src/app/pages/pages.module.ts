import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatPagesModule } from './chat/chat-pages.module';
import { ClientsPagesModule } from './clients/clients-pages.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClientsPagesModule,
        ChatPagesModule
    ]
})
export class PagesModule { }
