import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, MissingTranslationHandlerParams, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppConfig } from '../../config';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient, '/assets/lang/', '-lang.json');
}

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        // return back the original key if translation was not found
        return params.key;
    }
}

