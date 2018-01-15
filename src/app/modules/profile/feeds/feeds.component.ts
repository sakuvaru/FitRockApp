// common
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { LoadMoreConfig } from '../../../../web-components/load-more';
import { BaseComponent, ComponentDependencyService, ComponentSetup } from '../../../core';
import { Feed, FeedResult } from '../../../models';
import { MyProfileMenuItems } from '../menu.items';

@Component({
    templateUrl: 'feeds.component.html'
})
export class FeedsComponent extends BaseComponent implements OnInit {

    public loadMoreConfig: LoadMoreConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup {
        return new ComponentSetup({
            initialized: true,
            isNested: false
        });
    }

    ngOnInit() {
        super.ngOnInit();

        this.initMenu();
        this.initLoadMore();

        super.subscribeToObservable(this.getMarkAllFeedsAsReadObservable(), { enableLoader: false });
    }

    private initMenu(): void {

        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.feeds' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }

    private getMarkAllFeedsAsReadObservable(): Observable<any> {
        return this.dependencies.itemServices.feedService.markAllFeedsAsReadForUser(this.dependencies.authenticatedUserService.getUserId());
    }

    private initLoadMore(): void {
        this.loadMoreConfig = this.dependencies.webComponentServices.loadMoreService.loadMore<Feed>(
            (search) => this.dependencies.itemServices.feedService.getFeedsForUser(this.dependencies.authenticatedUserService.getUserId())
        )
            .text((item) => {
                const feedResult = this.getFeedResult(item);
                if (feedResult) {
                    if (feedResult.shouldBeTranslated() && feedResult.translationKey) {
                        return super.translate(feedResult.translationKey, feedResult.translationData);
                    }
                    if (feedResult.text) {
                        return Observable.of(feedResult.text);
                    }
                }
                return Observable.of('');
            })
            .title(item => {
                const feedResult = this.getFeedResult(item);

                if (!feedResult) {
                    return Observable.of(super.fromNow(item.created));
                }
                return Observable.of(feedResult.subject + ' ' + '<span class="mat-caption">' + super.fromNow(item.created) + '</span>');
            })
            .iconResolver(item => this.getFeedIcon(item))
            .imageResolver(item => this.getFeedImage(item))
            .iconClassResolver(item => !item.markedAsRead ? 'tc-red-500' : '')
            .pageSize(15)
            .showSearch(false)
            .build();
    }

    private getFeedIcon(feed: Feed): string | undefined {
        const result = this.getFeedResult(feed);

        return result ? result.icon : undefined;
    }

    private getFeedImage(feed: Feed): string | undefined {
        const result = this.getFeedResult(feed);

        return result ? result.imageUrl : undefined;
    }

    private getFeedResult(feed: Feed): FeedResult | null {
        return this.dependencies.itemServices.feedService.getFeedResult(feed);
    }
}
