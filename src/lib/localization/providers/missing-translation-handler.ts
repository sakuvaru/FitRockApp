import { MissingTranslationHandlerParams, MissingTranslationHandler } from '@ngx-translate/core';

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        // return back the original key if translation was not found
        return params.key;
    }
}
