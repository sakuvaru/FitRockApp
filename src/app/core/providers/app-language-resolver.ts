import { Injectable } from '@angular/core';
import { LanguageResolver } from '../../../lib/localization';
import { LanguageService } from '../services/language.service';

@Injectable()
export class AppLanguageResolver implements LanguageResolver {

    constructor(
        private languageService: LanguageService
    ) { }

    getCurrentLanguage(): string {
        return this.languageService.getLanguage().uiLanguage;
    }
}
