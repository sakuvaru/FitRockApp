import { ResponseGetBase } from './response-get-base.class';

export class ResponseMultiple extends ResponseGetBase {
  constructor(
    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,
    result: number,
    public items: any[]
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

