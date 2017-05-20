import { ResponseGetBase } from './response-get-base.class';
import { IItem } from './iitem.class';

export class ResponseSingle extends ResponseGetBase {
  constructor(
    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,
    result: number,
    public item: IItem
  ) {
    super(
      fromCache,
      timeCreated,
      type,
      action,
      result
    )
  }
}

