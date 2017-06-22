import { Http } from '@angular/http';
import { TranslateModule, MissingTranslationHandlerParams, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppConfig } from '../config/app.config';

export function HttpLoaderFactory(http: Http) {
    return new TranslateHttpLoader(http, '/assets/lang/', '-lang.json');
}

export class CustomMissingTranslationHandler implements MissingTranslationHandler{
    handle(params: MissingTranslationHandlerParams){
        // return back the original key if translation was not found
        return params.key;
    }
}