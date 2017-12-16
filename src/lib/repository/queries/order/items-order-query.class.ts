import { Observable } from 'rxjs/Rx';
import { QueryService } from 'lib/repository/services/query.service';

import { IItem } from '../../interfaces/iitem.interface';
import { ResponseUpdateItemsOrder } from '../../models/responses';
import { OrderItem, UpdateItemsRequest } from '../../models/update-items-request.class';
import { BaseQuery } from '../base-query.class';

export class ItemsOrderQuery<TItem extends IItem> extends BaseQuery {

    private readonly defaultAction = 'updateItemsOrder';

    private _action: string;
    private _data: any = {};

    private updateRequest: UpdateItemsRequest;

    constructor(
        protected queryService: QueryService,
        protected type: string,
        private orderedItems: TItem[],
        private distinguishByValue: number
    ) {
        super(queryService);
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
