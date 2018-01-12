export class StringHelper {

    /**
     * Converts first char of the text to lowercase
     * @param text text
     */
    firstCharToLowerCase(text): string {
        if (!text) {
            return '';
        }
        return text.charAt(0).toLowerCase() + text.slice(1);
    }

    /**
    * Converts string to camel case
    * @param text text
    */
    toCamelCase(text): string {
        return this.firstCharToLowerCase(text);
    }

    /**
     * capitalizeTxt('this is a test'); // returns 'This is a test'
     * @param text text to capitalize
     */
    capitalizeText(text): string {
        if (!text) {
            return '';
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    isValidEmail(email): boolean {
        if (!email) {
            return false;
        }

        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }

    /**
     * Removes everything in text before given string
     * @param text Text
     * @param beforeString String to match
     */
    removeEverythingBefore(text: string, beforeString: string): string {
        return text.substring(text.indexOf(beforeString) + 1);
    }

    /**
     * Gets hash from given string
     * @param text text to hash
     */
    getHash(text: string): number {
        let hash = 0, i, chr;
        if (!text) {
            return hash;
        }

        for (i = 0; i < text.length; i++) {
            chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Returns true if text contains the other one
     * @param text text
     * @param contains text to contain
     */
    contains(text: string, contains: string): boolean {
        if (!text || !contains) {
            return false;
        }
        return text.indexOf(contains) !== -1;
    }

    /**
    * Returns true if text contains one of the given inputs
    * @param text text
    * @param contains text array
    */
    containsAny(text: string, containsArr: string[]): boolean {
        if (!text || !containsArr || !Array.isArray(containsArr)) {
            return false;
        }

        let result = false;

        containsArr.forEach(contains => {
            const textContainsResult = text.indexOf(contains) !== -1;
            if (textContainsResult) {
                result = true;
                return;
            }
        });

        return result;
    }

    /**
    * Shortens given text
    * @param text text to shorten
    * @param chars number of characters to keep
    * @param addDots dots to be added if the text is shortened
    */
    shorten(text: string, chars: number, addDots?: boolean): string {
        if (!text || !chars) {
            return '';
        }

        if (text.length <= chars) {
            return text;
        }

        let shortenedText = text.substr(0, chars);

        if (addDots) {
            shortenedText += '...';
        }

        return shortenedText;
    }

    /**
     * Checks if given value is string
     * @param value Value to check
     */
    isString(value: any): boolean {
        if (typeof value === 'string' || value instanceof String) {
            return true;
        }
        return false;
    }

}

export let stringHelper = new StringHelper();
