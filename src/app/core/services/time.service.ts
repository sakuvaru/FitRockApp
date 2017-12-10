import 'moment/locale/cs';

import { Injectable } from '@angular/core';
import { LanguageConfig } from 'app/core';
import * as moment from 'moment';

import { CurrentLanguageService } from './current-language.service';

@Injectable()
export class TimeService {

    private currentLanguage: LanguageConfig;

    constructor(
        private currentLanguageService: CurrentLanguageService
    ) {
        this.currentLanguage = currentLanguageService.getLanguage();
    }

    moment(date: moment.MomentInput, strict?: boolean): moment.Moment {
        if (!this.currentLanguage.locale) {
            throw Error('Locale has to be set');
        }
        return moment(date).locale(this.currentLanguage.locale);
    }

    formatDate(date: Date): string {
        if (!this.currentLanguage.locale) {
            throw Error('Locale has to be set');
        }
        return moment(date).locale(this.currentLanguage.locale).format('LL');
    }

    fromNow(date: Date): string {
        if (!this.currentLanguage.locale) {
            throw Error('Locale has to be set');
        }
        return moment(date).locale(this.currentLanguage.locale).fromNow();
    }
}
