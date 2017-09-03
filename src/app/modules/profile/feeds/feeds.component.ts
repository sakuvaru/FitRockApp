// common
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, UrlConfig, ComponentDependencyService, BaseComponent } from '../../../core';

// requied by component
import { MyProfileMenuItems } from '../menu.items';
import { FormConfig } from '../../../../web-components/dynamic-form';
import { Feed } from '../../../models';
import { DataTableConfig, AlignEnum, Filter } from '../../../../web-components/data-table';
import { Observable } from 'rxjs/Rx';
import { StringHelper } from '../../../../lib/utilities';

@Component({
    templateUrl: 'feeds.component.html'
})
export class FeedsComponent extends BaseComponent implements OnInit {

    private config: DataTableConfig<Feed>;

    constructor(
        protected dependencies: ComponentDependencyService) {
        super(dependencies)
    }

    ngOnInit() {
        super.ngOnInit();

        this.initMenu();
        this.initDataTable();
    }

    private initMenu(): void {

        this.setConfig({
            componentTitle: { key: 'module.profile.submenu.feeds' },
            menuItems: new MyProfileMenuItems().menuItems,
            menuTitle: { key: 'module.profile.submenu.myProfile' },
        });
    }

    private initDataTable(): void {
        this.config = this.dependencies.webComponentServices.dataTableService.dataTable<Feed>()
            .fields([
                {
                    value: (item) => {
                        var feedResult = this.dependencies.itemServices.feedService.getFeedResult(item);
                        if (feedResult && feedResult.text){
                            return feedResult.text
                        }
                        return '';
                    },
                    flex: 70
                },
                {
                    value: (item) => super.fromNow(item.created),
                    isSubtle: true,
                    align: AlignEnum.Right,
                    hideOnSmallScreens: true,
                    flex: 30
                },
            ])
            .iconResolver(item => {
               return this.getFeedIcon(item)
            })
            .loadQuery(searchTerm => {
                return this.dependencies.itemServices.feedService.getFeedsForUser(this.dependencies.authenticatedUserService.getUserId())
            })
            .loadResolver(query => {
                return query
                    .get()
                    .takeUntil(this.ngUnsubscribe)
            })
            .showAllFilter(false)
            .onBeforeLoad(isInitialLoad => isInitialLoad ? super.startLoader() : super.startGlobalLoader())
            .onAfterLoad(isInitialLoad => isInitialLoad ? super.stopLoader() : super.stopGlobalLoader())
            .showPager(true)
            .showSearch(false)
            .pagerSize(10)
            .build();
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