// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';
import { AppConfig, UrlConfig } from '../../../config';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Feed, FeedResult } from '../../../models';
import { DataListConfig, AlignEnum, Filter } from '../../../../web-components/data-list';
import { Observable } from 'rxjs/Rx';
import { StringHelper } from '../../../../lib/utilities';
import { LoadMoreConfig } from '../../../../web-components/load-more';

@Component({
    templateUrl: 'feeds.component.html'
})
export class FeedsComponent extends BaseComponent implements OnInit {

    public config: DataListConfig<Feed>;
    public loadMoreConfig: LoadMoreConfig;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies);
    }

    setup(): ComponentSetup | null {
        return {
            initialized: true
        };
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
                return Observable.of(feedResult.subject + ' ' + '<span class="md-caption">' + super.fromNow(item.created) + '</span>');
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
