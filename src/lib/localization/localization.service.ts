import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { LanguageResolver } from './language-resolver';

@Injectable()
export class LocalizationService {


    constructor(
        private translateService: TranslateService,
        private languageResolver: LanguageResolver
    ) {
        // listen to language changes & update default language
        this.translateService.setDefaultLang(this.languageResolver.getCurrentLanguage());
    }

    /**
     * Gets translation of given key
     * @param key Translation key
     * @param interpolateParams 
     */
    get(key: string,  interpolateParams?: Object): Observable<string> {
        return this.translateService.get(key, interpolateParams);
    }


}
