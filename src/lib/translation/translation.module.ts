import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// services
import { FormTranslationService } from './form/form-translation.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    providers: [
        FormTranslationService
    ],
    exports: [
    ]
})
export class TranslationModule { }