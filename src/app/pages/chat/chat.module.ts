import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { ChatPageComponent } from './chat-page.component';
import { ChatRouter } from './chat.routing';

@NgModule({
    imports: [
        PagesCoreModule,
        ChatRouter,
    ],
    declarations: [
        ChatPageComponent,
    ]
})
export class ChatModule { }
