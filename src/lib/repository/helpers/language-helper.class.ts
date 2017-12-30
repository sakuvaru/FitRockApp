import { LanguageEnum } from '../enums/language.enum';

class LanguageHelper {

    getLanguage(languageEnumIndex: number): LanguageEnum {
        if (languageEnumIndex === 0) {
            return LanguageEnum.Default;
        } else if (languageEnumIndex === 1) {
            return LanguageEnum.Cz;
        } else if (languageEnumIndex === 2) {
            return LanguageEnum.En;
        }

        throw Error(`Unsupported language with index '${languageEnumIndex}'`);

    }
}

export const languageHelper = new LanguageHelper();
