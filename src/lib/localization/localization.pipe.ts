import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageResolver } from './language-resolver';

@Pipe({
    name: 'localize',
    pure: false // required to update the value when the promise is resolved

})
export class LocalizationPipe extends TranslatePipe implements PipeTransform {
  
    static processTranslateService(translateService: TranslateService, languageResolver: LanguageResolver): TranslateService {
        translateService.setDefaultLang(languageResolver.getCurrentLanguage());
        return translateService;
    }

    constructor(
        private translateService: TranslateService,
        private languageResolver: LanguageResolver,
        private cdr: ChangeDetectorRef
    ) {
        super(LocalizationPipe.processTranslateService(translateService, languageResolver), cdr);
    }

    transform(query: string, ...args: any[]): any {
        let passArgs: any = {};
        if (args.length > 0 ) {
            passArgs = args[0];
        }
        return super.transform(query, passArgs);
    }
}
