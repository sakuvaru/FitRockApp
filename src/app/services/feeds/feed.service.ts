import { Injectable } from '@angular/core';
import { Feed, FeedResult } from '../../models';
import { RepositoryClient, MultipleItemQuery, ResponseMultiple, ResponseEdit } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';
import { Observable } from 'rxjs/Rx';
import { stringHelper } from '../../../lib/utilities';

@Injectable()
export class FeedService extends BaseTypeService<Feed> {

    constructor(repositoryClient: RepositoryClient) {
        super (repositoryClient, {
            type: 'Feed',
            allowDelete: false
        });
    }

    /**
     * Gets anagular material icon for given feed with type
     */
    getFeedIcon(feedType: string): string {
        const defaultIcon = 'today';

        if (!feedType) {
            return defaultIcon;
        }

        if ( feedType.toLowerCase() === 'message') {
            return 'mail';
        }

        return defaultIcon;
    }

     /**
     * Gets feed result (text, key) based on its type
     */
    getFeedResult(feed: Feed): FeedResult | null {
        if (!feed) {
            return null;
        }

        // message feeds
        if (feed.feedType.toLowerCase() === 'message') {
            // prepare translation data
            const translationData: any = {};
            const chatMessageData = feed.data.find(m => m.key === 'Message');
            const userData = feed.data.find(m => m.key === 'User');

            translationData.message = chatMessageData ? stringHelper.shorten(chatMessageData.value, 85, true) : '';
            translationData.user = userData ? userData.value : '';

            return new FeedResult({
                data: feed.data,
                translationKey: 'module.feeds.userSentYouAMessage',
                translationData: translationData,
            });
        }
        return null;
    }

    markFeedAsRead(feed: Feed): Observable<ResponseEdit<Feed>> {
        feed.markedAsRead = true;
        return super.edit(feed).set();
    }

     getCountOfUnreadNotifications(userId: number): Observable<number> {
        return this.count()
        .whereEquals('FeedUserId', userId)
        .whereEquals('MarkedAsRead', false)
        .get()
        .map(response => response.count);
    }

     getFeedsForUser(userId: number, limit?: number): MultipleItemQuery<Feed> {
        const query = this.items()
            .whereEquals('FeedUserId', userId)
            .orderByDesc('Created');

        if (limit) {
            query.limit(limit);
        }

        return query;
    }
}
