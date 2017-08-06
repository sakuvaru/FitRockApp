export class NumberHelper {

    /**
     * Returns true if given parameter is a number, false otherwise
     * @param value value to check 
     */
    static isNumber(value) {
        var number = +value;
        if (number){
            return true;
        }
        return false;
    }
}
