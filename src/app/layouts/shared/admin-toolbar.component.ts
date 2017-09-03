import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ComponentDependencyService, BaseComponent, MenuItemType, AppConfig } from '../../core';

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

    constructor(protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit() {
        this.subscribeToFeedObservables();
    }

    private subscribeToFeedObservables():void{
        // do not run it through super.subscribeToObservable
        // as it causes some issues

        this.dependencies.itemServices.feedService.getCountOfUnreadNotifications(this.dependencies.authenticatedUserService.getUserId())
            .takeUntil(this.ngUnsubscribe)
            .map(count => this.feedsCount = count)
            .subscribe();

        this.dependencies.itemServices.feedService.getFeedsForUser(this.dependencies.authenticatedUserService.getUserId(), this.limitFeedsCount)
            .get()
            .takeUntil(this.ngUnsubscribe)
            .map(response => this.feeds = response.items)
            .subscribe();
    }

    private getFeedUrl(feed: Feed): string | null{
        if (!feed){
            return null;
        }

        // construct url based on field type
        if (feed.feedType.toLowerCase() == 'message'){
            console.warn('New chat app needs to be created and this should point to it');
            return super.getTrainerUrl('clients');
        }

        return null;
    }

    private getFeedIcon(feed: Feed): string {
        return this.dependencies.itemServices.feedService.getFeedIcon(feed.feedType);
    }

    private getFeedText(feed: Feed): Observable<string> {
        var feedResult = this.dependencies.itemServices.feedService.getFeedResult(feed);

        if (!feedResult){
            return Observable.of('');
        }

        // output direct text
        if (feedResult.text){
            return Observable.of(StringHelper.shorten(feedResult.text, 85, true));
        }

        // translate output
        if (feedResult.translationKey){
            return super.translate(feedResult.translationKey, feedResult.translationData);
        }

        // something went wrong
        if (AppConfig.DevModeEnabled){
            console.warn('Could not process feed result for Feed -> Id = ' + feed.id);
        }

        return Observable.of('');
    }
}