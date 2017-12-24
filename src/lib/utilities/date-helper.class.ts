export class DateHelper {

    /**
     * Returns true if given parameter is a date, false otherwise
     * @param value value to check
     */
    isDate(value) {
        if (typeof value.getMonth === 'function' && value instanceof Date) {
            return true;
        }
        return false;
    }
}

export let dateHelper = new DateHelper();
