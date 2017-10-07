export class NumberHelper {

    /**
     * Returns true if given parameter is a number, false otherwise
     * @param value value to check
     */
    isNumber(value) {
        const number = +value;
        if (number) {
            return true;
        }
        return false;
    }
}

export let numberHelper = new NumberHelper();
