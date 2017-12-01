import { Injectable } from '@angular/core';
import { LanguageResolver } from '../../../lib/localization';
import { CurrentLanguageService } from '../services/current-language.service';

@Injectable()
export class AppLanguageResolver implements LanguageResolver {

    constructor(
        private currentLanguageService: CurrentLanguageService
    ) { }

    getCurrentLanguage(): string {
        return this.currentLanguageService.getLanguage().uiLanguage;
    }
}
