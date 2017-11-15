import { Injectable } from '@angular/core';
import { LanguageConfig } from '../models/core.models';
import { LanguageEnum } from '../../../lib/repository';

@Injectable()
export class LanguageService {

    /**
     * Default language
     */
    public defaultLanguage: LanguageConfig = new LanguageConfig('cs', 'cs');

    /**
     * Name of the local storage key where authenticated user is stored
     */
    private readonly authUserStorageKey = 'auth_user';

    constructor(
    ) {
    }

    /**
     * Gets varios culture strings used by application
     * @param language Language stored in db
     */
    getLanguage(language: LanguageEnum): LanguageConfig {
        if (language === LanguageEnum.Default) {
            return this.defaultLanguage;
        }

        if (language === LanguageEnum.Cz) {
            return new LanguageConfig('cs', 'cs');
        }

        if (language === LanguageEnum.En) {
            return new LanguageConfig('en', 'en');
        }

        console.warn('Language invalid, default language used');
        return this.defaultLanguage;
    }
}
