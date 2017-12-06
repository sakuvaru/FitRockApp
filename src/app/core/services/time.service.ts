import { CurrentLanguageService } from './current-language.service';
import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../models/core.models';
import { SharedService } from './shared.service';

import * as moment from 'moment';
import 'moment/locale/cs';
import { LanguageConfig } from 'app/core';

@Injectable()
export class TimeService {

    private currentLanguage: LanguageConfig;

    constructor(
        private currentLanguageService: CurrentLanguageService
    ) {
        this.currentLanguage = currentLanguageService.getLanguage();
    }

    moment: (inp: moment.MomentInput, strict?: boolean) => moment.Moment;

    formatDate(date: Date): string {
        return moment(date).locale(this.currentLanguage.momentJs).format('LL');
    }

    fromNow(date: Date): string {
        return moment(date).locale(this.currentLanguage.momentJs).fromNow();
    }
}
