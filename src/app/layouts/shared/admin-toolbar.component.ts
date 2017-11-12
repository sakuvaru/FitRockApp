import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ComponentDependencyService, BaseComponent, MenuItemType, ComponentSetup } from '../../core';
import { AppConfig, UrlConfig } from '../../config';

import { StringHelper } from '../../../lib/utilities';
import { Feed, FeedResult } from '../../models';
import { Observable, Subscriber } from 'rxjs/Rx';

@Component({
    selector: 'admin-toolbar',
    templateUrl: 'admin-toolbar.component.html'
})
export class AdminToolbarComponent extends BaseComponent implements OnInit {

    private feedsCount: number;
    private feeds: Feed[];

    private readonly limitFeedsCount: number = 8;

    /**
     * This field is used to prevent feeds from being changed when clicking on them (clicking changes its 'markedAsRead' status
     * which would change styling of the item)
     */
    private preventFeedChange: boolean = false;

    constructor(protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return null;
    }

    ngOnInit() {
        this.subscribeToFeedObservables();
    }

    private subscribeToFeedObservables(): void {
        // do not run it through super.subscribeToObservable
        // as it causes some issues with rendering of the layout template (e.g. the icons are not resolved, the media queries do not work...)

        this.dependencies.itemServices.feedService.getCountOfUnreadNotifications(this.dependencies.authenticatedUserService.getUserId())
            .takeUntil(this.ngUnsubscribe)
            .subscribe(count => this.feedsCount = count, error => super.handleError(error));

        this.dependencies.itemServices.feedService.getFeedsForUser(this.dependencies.authenticatedUserService.getUserId(), this.limitFeedsCount)
            .get()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => {
                return this.feeds = response.items;
            },
            error => super.handleError(error));
    }

    private getFeedUrl(feed: Feed): string | null {
        if (!feed) {
            return null;
        }

        // construct url based on field type
        if (feed.feedType.toLowerCase() === 'message') {
            const senderUserIdData = feed.data.find(m => m.key === 'SenderUserId');

            return super.getAuthUrl('chat/' + (senderUserIdData ? senderUserIdData.value : ''));
        }

        return null;
    }

    private getFeedIcon(feed: Feed): string | undefined {
        const result = this.dependencies.itemServices.feedService.getFeedResult(feed);
        return result ? result.icon : undefined;
    }

    private getFeedImage(feed: Feed): string | undefined {
        const result = this.dependencies.itemServices.feedService.getFeedResult(feed);
        return result ? result.imageUrl : undefined;
    }

    private getFeedSubject(feed: Feed): string {
        const feedResult = this.dependencies.itemServices.feedService.getFeedResult(feed);

        if (!feedResult) {
            return '';
        }

        return feedResult.subject;
    }

    private getFeedText(feed: Feed): Observable<string> {
        const feedResult = this.dependencies.itemServices.feedService.getFeedResult(feed);

        if (!feedResult) {
            return Observable.of('');
        }

        // output direct text
        if (feedResult.text) {
            return Observable.of(feedResult.shortenText());
        }

        // translate output
        if (feedResult.translationKey && feedResult.shouldBeTranslated()) {
            return super.translate(feedResult.translationKey, feedResult.translationData);
        }

        // something went wrong
        if (AppConfig.DevModeEnabled) {
            console.warn('Could not process feed result for Feed -> Id = ' + feed.id);
        }

        return Observable.of('');
    }

    private handleClickFeed(feed: Feed): void {
        if (feed) {
            this.preventFeedChange = true;

            // mark feed as read upon clicking
            this.getMarkAsReadObservable(feed)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(response => {
                    this.preventFeedChange = false;

                    // there is one less unread feed
                    if (this.feedsCount > 0) {
                        this.feedsCount--;
                    }

                    // go to feed details
                    const feedUrl = this.getFeedUrl(feed);
                    if (!feedUrl) {
                        console.warn('Cannot navigate to feed with id = ' + feed.id);
                    }

                    super.navigate([feedUrl]);
                });
        } else {
            console.warn('Cannot click on invalid feed');
        }
    }

    private getMarkAsReadObservable(feed: Feed): Observable<any> {
        return this.dependencies.itemServices.feedService.markFeedAsRead(feed);
    }
}
