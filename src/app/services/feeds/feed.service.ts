import { Injectable } from '@angular/core';
import { Feed, FeedResult } from '../../models';
import { RepositoryClient, MultipleItemQuery, ResponseMultiple, ResponseEdit, ResponsePost } from '../../../lib/repository';
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
     * Gets feed result (text, key) based on its type
     */
    getFeedResult(feed: Feed): FeedResult | null {
        if (!feed) {
            return null;
        }

        // message feeds
        if (feed.feedType.toLowerCase() === 'message') {
            const chatMessageData = feed.data.find(m => m.key === 'Message');
            const userData = feed.data.find(m => m.key === 'User');

            return new FeedResult({
                subject: userData ? userData.value : '',
                data: feed.data,
                text: chatMessageData ? stringHelper.shorten(chatMessageData.value, 85, true) : '',
                imageUrl: feed.imageUrl
            });
        }
        return null;
    }

    markFeedAsRead(feed: Feed): Observable<ResponseEdit<Feed>> {
        feed.markedAsRead = true;
        return super.edit(feed).set();
    }

    markAllFeedsAsReadForUser(userId: number): Observable<ResponsePost<boolean>> {
        if (!userId) {
            throw new Error('Invalid user');
        }
        return super.post<boolean>('MarkAllFeedsAsReadForUser').withJsonOption('UserId', userId).set();
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
