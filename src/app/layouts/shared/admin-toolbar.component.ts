import { Component, NgZone, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { AppConfig, UrlConfig } from '../../config';
import { ComponentDependencyService, AuthenticatedUser } from '../../core';
import { Feed } from '../../models';
import { BaseLayoutComponent } from '../base/base-layout.component';
import { MatSidenav } from '@angular/material';

@Component({
    selector: 'admin-toolbar',
    templateUrl: 'admin-toolbar.component.html'
})
export class AdminToolbarComponent extends BaseLayoutComponent {

    @Input() matSidenav: MatSidenav;

    public feedsCount: number;
    public feeds: Feed[];

    public defaultAvatarUrl: string = AppConfig.DefaultUserAvatarUrl;
    public showAvatar: boolean = false;
    public license: string | undefined;
    public userAvatarUrl?: string;
    public username?: string;

    public readonly limitFeedsCount: number = 8;

    /**
     * This field is used to prevent feeds from being changed when clicking on them (clicking changes its 'markedAsRead' status
     * which would change styling of the item)
     */
    public preventFeedChange: boolean = false;

    public authUser?: AuthenticatedUser;

    constructor(
        protected dependencies: ComponentDependencyService,
        protected ngZone: NgZone
    ) {
        super(dependencies, ngZone);
        this.initUser();
        this.subscribeToFeedObservables();
    }

    private initUser(): void {
        this.authUser = this.dependencies.authenticatedUserService.getUser();
        if (this.authUser) {
        this.userAvatarUrl = this.authUser.getAvatarOrGravatarUrl();
        this.showAvatar = true;
        this.license = this.authUser.license;
        this.username = this.authUser.firstName && this.authUser.lastName ? `${this.authUser.firstName} ${this.authUser.lastName}` : this.authUser.email;

        // listen to user changes and update avatar accordingly
        this.dependencies.coreServices.sharedService.authenticatedUserChanged$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
            user => {
                if (user && user.avatarUrl) {
                    this.userAvatarUrl = user.avatarUrl;
                }
            });

        }
    }

    private subscribeToFeedObservables(): void {
        // do not run it through super.subscribeToObservable
        // as it causes some issues with rendering of the layout template (e.g. the icons are not resolved, the media queries do not work...)
        this.dependencies.itemServices.feedService.getCountOfUnreadNotifications(this.dependencies.authenticatedUserService.getUserId())
            .takeUntil(this.ngUnsubscribe)
            .subscribe(count => this.feedsCount = count, error => console.error('Admin toolbar encountered an error loading notifications'));

        this.dependencies.itemServices.feedService.getFeedsForUser(this.dependencies.authenticatedUserService.getUserId(), this.limitFeedsCount)
            .get()
            .takeUntil(this.ngUnsubscribe)
            .subscribe(response => {
                return this.feeds = response.items;
            },
            error => console.error('Admin toolbar encountered an error loading feeds'));
    }

    public getFeedUrl(feed: Feed): string | null {
        if (!feed) {
            return null;
        }

        // construct url based on field type
        if (feed.feedType.toLowerCase() === 'message') {
            const senderUserIdData = feed.data.find(m => m.key === 'SenderUserId');

            return UrlConfig.getAuthUrl('chat/' + (senderUserIdData ? senderUserIdData.value : ''));
        }

        return null;
    }

    public getFeedIcon(feed: Feed): string | undefined {
        const result = this.dependencies.itemServices.feedService.getFeedResult(feed);
        return result ? result.icon : undefined;
    }

    public getFeedImage(feed: Feed): string | undefined {
        const result = this.dependencies.itemServices.feedService.getFeedResult(feed);
        return result ? result.imageUrl : undefined;
    }

    public getFeedSubject(feed: Feed): string {
        const feedResult = this.dependencies.itemServices.feedService.getFeedResult(feed);

        if (!feedResult) {
            return '';
        }

        return feedResult.subject;
    }

    public getFeedText(feed: Feed): Observable<string> {
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
            return this.dependencies.coreServices.localizationService.get(feedResult.translationKey, feedResult.translationData);
        }

        // something went wrong
        if (AppConfig.DevModeEnabled) {
            console.warn('Could not process feed result for Feed -> Id = ' + feed.id);
        }

        return Observable.of('');
    }

    public handleClickFeed(feed: Feed): void {
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

                    this.dependencies.coreServices.navigateService.navigate([feedUrl]);
                });
        } else {
            console.warn('Cannot click on invalid feed');
        }
    }

    private getMarkAsReadObservable(feed: Feed): Observable<any> {
        return this.dependencies.itemServices.feedService.markFeedAsRead(feed);
    }
}
