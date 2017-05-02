import { ResponseBase } from './response-base.class';

export class ResponseMultiple extends ResponseBase {
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

