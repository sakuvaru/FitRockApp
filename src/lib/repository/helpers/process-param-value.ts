
/**
 * Gets proper 'string' value of string, number or boolean value
 * @param value Value to be processed
 */
export function processParamValue(value: string | number | boolean | Date | undefined): string {
    if (typeof (value) === 'boolean') {
        if (!value) {
            return 'false';
        }
        return 'true';
    }

    if (!value) {
        return '';
    }
    return value.toString().trim();
}
