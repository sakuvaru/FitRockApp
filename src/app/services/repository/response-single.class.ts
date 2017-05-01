import { ResponseBase } from './response-base.class';

export class ResponseSingle extends ResponseBase {
  constructor(
    fromCache: boolean,
    timeCreated: Date,
    type: string,
    action: string,
    result: number,
    public item: any
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

