import { stringHelper } from 'lib/utilities';

export class Day {

    public localizationKey?: string;

    constructor(
        public day: number,
        public dayString: string
    ) { 
        this.localizationKey = 'module.days.' + stringHelper.firstCharToLowerCase(dayString);
    }
}
