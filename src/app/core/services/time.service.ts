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
        return moment(date).locale(this.currentLanguage.momentJs);
    }

    formatDate(date: Date): string {
        return moment(date).locale(this.currentLanguage.momentJs).format('LL');
    }

    fromNow(date: Date): string {
        return moment(date).locale(this.currentLanguage.momentJs).fromNow();
    }
}
