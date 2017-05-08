import { ResponseGetBase } from './response-get-base.class';

export class ResponseSingle extends ResponseGetBase {
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

