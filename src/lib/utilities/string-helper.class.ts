export class StringHelper {

    /**
     * Converts first char of the text to lowercase
     * @param text text 
     */
    firstCharToLowerCase(text) {
        if (!text) {
            return null;
        }
        return text.charAt(0).toLowerCase() + text.slice(1);
    }

    /**
     * capitalizeTxt('this is a test'); // returns 'This is a test'
     * @param text text to capitalize
     */
    capitalizeText(text) {
        if (!text) {
            return null;
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    /**
     * Gets hash from given string
     * @param text text to hash
     */
    getHash(text: string): number {
        var hash = 0, i, chr;
        if (!text) return hash;
        for (i = 0; i < text.length; i++) {
            chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Returns true if text contains the other one
     * @param text text to hash
     */
    contains(text: string, contains: string): boolean {
        if (!text || !contains) {
            return false;
        }
        return text.indexOf(contains) !== -1;
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

        var shortenedText = text.substr(0, chars);

        if (addDots) {
            shortenedText += '...';
        }

        return shortenedText;
    }

}

export var stringHelper = new StringHelper();
