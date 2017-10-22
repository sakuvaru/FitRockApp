// config
import { RepositoryConfig } from '../../repository.config';

// services
import { AuthHttp } from 'angular2-jwt';
import { BaseQuery } from '../base-query.class';

// models
import { OrderItem, UpdateItemsRequest } from '../../models/update-items-request.class';
import { IItem } from '../../interfaces/iitem.interface';

// responses
import { ResponseUpdateItemsOrder } from '../../models/responses';

// rxjs
import { Observable } from 'rxjs/Rx';

export class ItemsOrderQuery<TItem extends IItem> extends BaseQuery {

    private readonly defaultAction = 'updateItemsOrder';

    private _action: string;
    private _data: any = {};

    private updateRequest: UpdateItemsRequest;

    constructor(
        protected authHttp: AuthHttp,
        protected config: RepositoryConfig,
        protected type: string,
        private orderedItems: TItem[],
        private distinguishByValue: number
    ) {
        super(authHttp, config);
        this._action = this.defaultAction;
        this.updateRequest = new UpdateItemsRequest(distinguishByValue, this.getItemsOrderJson(orderedItems));
    }

    /**
     * Sets custom action to be used for setting items order
     * @param action Action to be called
     */
    withCustomAction(action: string): this {
        this._action = action;
        return this;
    }

    // url
    protected getUpdateOrderUrl(): string {
        return this.queryService.getTypeUrl(this.type, this._action);
    }

    // execution

    set(): Observable<ResponseUpdateItemsOrder<TItem>> {
        return this.queryService.updateItemsOrder(this.getUpdateOrderUrl(), this.updateRequest);
    }

    // debug

    toString(): string {
        return this.getUpdateOrderUrl();
    }

    /* ------------ Private ---------- */

    private getItemsOrderJson(orderedItems: TItem[]): OrderItem[] {
        const data: OrderItem[] = [];
        if (orderedItems) {
            for (let i = 0; i < orderedItems.length; i++) {
                const orderItem = orderedItems[i];
                data.push(new OrderItem(orderItem.id, i));
            }
        }
        return data;
    }
}
