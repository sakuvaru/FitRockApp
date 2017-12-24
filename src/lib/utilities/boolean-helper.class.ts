export class BooleanHelper {

    /**
     * Returns true if given parameter is a boolean, false otherwise
     * @param value value to check
     */
    isBoolean(value) {
        if (typeof (value) === 'boolean') {
            return true;
        }
        return false;
    }
}

export let booleanHelper = new BooleanHelper();
