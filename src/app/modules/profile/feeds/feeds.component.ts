// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, BaseComponent, ComponentSetup } from '../../../core';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Feed, FeedResult } from '../../../models';
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Observable } from 'rxjs/Rx';
import { StringHelper } from '../../../../lib/utilities';
import { LoadMoreConfig } from '../../../../web-components/load-more';

@Component({
    templateUrl: 'feeds.component.html'
})
export class FeedsComponent extends BaseComponent implements OnInit {

    private config: DataTableConfig<Feed>;
    private loadMoreConfig: LoadMoreConfig<Feed>;

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
    }

    private initMenu(): void {

        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.feeds' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }

    private initLoadMore(): void {
        this.loadMoreConfig = this.dependencies.webComponentServices.loadMoreService.loadMore<Feed>(
            search => this.dependencies.itemServices.feedService.getFeedsForUser(this.dependencies.authenticatedUserService.getUserId()),
            query => query.get().takeUntil(this.ngUnsubscribe))
            .text((item: Feed) => {
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
            .footer((item: Feed) => Observable.of(super.fromNow(item.created)))
            .iconResolver(item => this.getFeedIcon(item))
            .iconClassResolver(item => !item.markedAsRead ? 'tc-red-500' : '')
            .pageSize(15)
            .loaderConfig(() => super.startGlobalLoader(), () => super.stopGlobalLoader())
            .showSearch(false)
            .build();
    }

    private getFeedIcon(feed: Feed): string {
        return this.dependencies.itemServices.feedService.getFeedIcon(feed.feedType);
    }

    private getFeedResult(feed: Feed): FeedResult | null {
        const feedResult = this.dependencies.itemServices.feedService.getFeedResult(feed);
        return feedResult;
    }
}
