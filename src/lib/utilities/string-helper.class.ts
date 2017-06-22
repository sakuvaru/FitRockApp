export class StringHelper {

    /**
     * Converts first char of the text to lowercase
     * @param text text 
     */
    static firstCharToLowerCase(text) {
        if (!text) {
            return null;
        }
        return text.charAt(0).toLowerCase() + text.slice(1);
    }

    /**
     * capitalizeTxt('this is a test'); // returns 'This is a test'
     * @param text text to capitalize
     */
    static capitalizeText(text) {
        if (!text) {
            return null;
        }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
