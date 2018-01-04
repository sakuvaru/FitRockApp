import { Injectable } from '@angular/core';
import { LanguageConfig } from '../models/core.models';
import { LanguageEnum, languageHelper } from '../../../lib/repository';

@Injectable()
export class CurrentLanguageService {

    /**
     * Default language
     */
    private readonly defaultLanguage: LanguageConfig = new LanguageConfig(LanguageEnum.Cz, 'cs', 'cs');

    /**
     * Name of the local storage key where language is stored
     */
    private readonly languageStorageKey = 'ui_language';

    constructor(
    ) {
    }

    isDifferentThanCurrent(languageEnum: LanguageEnum): boolean {
        const currentLanguage = this.getLanguage();

        const languageToCompare = languageEnum === LanguageEnum.Default ? this.defaultLanguage.language : languageEnum;

        if (currentLanguage.language === languageToCompare) {
            return false;
        }

        return true;
    }

    setLanguage(languageEnum: LanguageEnum): void {
        // get language config
        const config = this.getLanguageConfig(languageEnum);

        // store language
        this.storeLanguage(config);
    }

    getLanguage(): LanguageConfig {
        return this.getLanguageFromLocalStorage();
    }

    private getLanguageFromLocalStorage(): LanguageConfig {
        const languageJson = localStorage.getItem(this.languageStorageKey);

        if (!languageJson) {
            // return default language && store it
            return this.defaultLanguage;
        }

        // parse language from local storage
        const parsedJson = JSON.parse(languageJson) as LanguageConfig;

        return new LanguageConfig(languageHelper.getLanguage(parsedJson.language), parsedJson.locale, parsedJson.uiLanguage);
    }

    private storeLanguage(language: LanguageConfig): void {
        localStorage.setItem(this.languageStorageKey, JSON.stringify(language));
    }


    /**
     * Gets varios culture strings used by application
     * @param language Language stored in db
     */
    private getLanguageConfig(languageEnum: LanguageEnum): LanguageConfig {
        let language: LanguageConfig;

        if (languageEnum === LanguageEnum.Default) {
            language = this.defaultLanguage;
        } else if (languageEnum === LanguageEnum.Cz) {
            language = new LanguageConfig(languageEnum, 'cs', 'cs');
        } else if (languageEnum === LanguageEnum.En) {
            language = new LanguageConfig(languageEnum, 'en', 'en');
        } else {
            console.warn(`Language '${languageEnum}' is not valid. Default language used`);
            language = this.defaultLanguage;
        }

        return language;
    }
}
