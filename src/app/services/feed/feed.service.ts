import { Injectable } from '@angular/core';
import { Feed, FeedResult } from '../../models';
import { RepositoryClient, MultipleItemQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

@Injectable()
export class FeedService extends BaseTypeService<Feed>{

    constructor(repositoryClient: RepositoryClient) { 
        super (repositoryClient, {
            type: 'Feed',
            allowDelete: false
        })
    }

    /**
     * Gets anagular material icon for given feed with type
     */
    getFeedIcon(feedType: string): string{
        var defaultIcon = "today";

        if (!feedType){
            return defaultIcon;
        }

        if ( feedType.toLowerCase() === 'message'){
            return 'mail';
        }

        return defaultIcon;
    }

     /**
     * Gets feed result (text, key) based on its type
     */
    getFeedResult(feed: Feed): FeedResult | null {
        if (!feed){
            return null
        }

        // message feeds
        if (feed.feedType.toLowerCase() === 'message'){

            var chatMessageData = feed.data.find(m => m.key === 'Message');

            return new FeedResult({
                data: feed.data,
                text: chatMessageData ? chatMessageData.value : ''
            })
        }

            // construct url based on field type
            if (feed.type.toLowerCase() == 'message'){
               
            }

        return null;
    }
}