export class NumberHelper {

    /**
     * Returns true if given parameter is a number, false otherwise
     * @param value value to check
     */
    isNumber(value: any): boolean {
        const number = +value;
        if (number) {
            return true;
        }
        return false;
    }

    /**
     * Rounds number to given number of decimals
     * @param number 
     */
    roundTo(number: number, decimals: number): number {
        if (!number) {
            return 0;
        }

        return +((number).toFixed(decimals));       
    }
}

export let numberHelper = new NumberHelper();
