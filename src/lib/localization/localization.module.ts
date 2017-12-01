import { NgModule, ModuleWithProviders, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { LocalizationConfig } from './localization.config';
import { LocalizationService } from './localization.service';

import { TranslateModule, TranslateLoader, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { LanguageResolver } from './language-resolver';
import { HttpLoaderFactory } from './providers/http-loader-factory';
import { CustomMissingTranslationHandler } from './providers/missing-translation-handler';
import { LocalizationPipe } from './localization.pipe';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule.forChild({
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          }),
    ],
    providers: [
        LocalizationService
    ],
    declarations: [
        LocalizationPipe
    ],
    exports: [
        LocalizationPipe
    ]
})
export class LocalizationModule {
    static forRoot(config: LocalizationConfig): ModuleWithProviders {
        return {
            ngModule: LocalizationModule,
            providers: [
                config.languageResolver,
                LocalizationService
            ]
        };
    }
}


