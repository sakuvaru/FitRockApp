import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';
import { DataModel } from '../extra/data-model.class';
import { stringHelper } from '../../../lib/utilities';

export class Feed extends BaseItem {
    public feedUserId: number;
    public markedAsRead: boolean;
    public feedType: string;
    public data: DataModel[];
    public feedUser: User;
    public imageUrl: string;
}

export class FeedResult {

    /**
     * Subject of the feed
     * Can be name of user or something similar
     */
    public subject: string;

    /**
     * Icon of the feed
     */
    public icon?: string;

    /**
     * Image url of the feed
     */
    public imageUrl?: string;

    /**
     * Data passed to feed
     */
    public data: DataModel[];

    /**
     * Translation key of the feed
     */
    public translationKey?: string;

    /**
     * Additional data for translation
     */
    public translationData?: string;

    /**
     * Raw text returned with feed (e.g. message text is not and cannot be translated)
     */
    public text?: string;

    /**
     * Same as text, but shortened
     */
    public shortenText(): string {
        if (this.text) {
            return stringHelper.shorten(this.text, 85, true);
        }

        return '';
    }

    /**
    * Indicates if translation key is present and the feed should be translated
    */
    public shouldBeTranslated(): boolean {
        return this.translationKey != null;
    }

    constructor(
        options: {
            subject: string,
            data?: DataModel[],
            translationKey?: string,
            translationData?: any
            text?: string,
            icon?: string,
            imageUrl?: string
        }
    ) {
        Object.assign(this, options);
    }
}

