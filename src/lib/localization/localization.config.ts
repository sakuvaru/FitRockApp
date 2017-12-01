import { Provider } from '@angular/core';

export class LocalizationConfig {
    constructor(
        /**
         * LanguageResolver class is expected
         */
        public languageResolver: Provider
    ) { }
}
