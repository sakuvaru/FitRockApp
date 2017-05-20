import { ResponseGetBase } from './response-get-base.class';
import { IItem } from './iitem.class';

export class ResponseMultiple extends ResponseGetBase {
  constructor(
    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,
    result: number,
    public items: IItem[]
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

