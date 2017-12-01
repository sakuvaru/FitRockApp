import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageResolver } from './language-resolver';

@Pipe({
    name: 'localize',
    pure: false // required to update the value when the promise is resolved
})
export class LocalizationPipe extends TranslatePipe implements PipeTransform {
  
    constructor(
        private translateService: TranslateService,
        private languageResolver: LanguageResolver,
        private cdr: ChangeDetectorRef
    ) {
        super(LocalizationPipe.getTranslateService(translateService, languageResolver), cdr);
    }

    static getTranslateService(translateService: TranslateService, languageResolver: LanguageResolver): TranslateService {
        translateService.setDefaultLang(languageResolver.getCurrentLanguage());
        return translateService;
    }
}
