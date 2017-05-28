import { ResponseTypeEnum } from './response-type.enum';
import { IErrorResponse } from './ierror-response';

export class ErrorResponse implements IErrorResponse{

    public statusType: ResponseTypeEnum;

    constructor(
        public error: string,
        public result: number,
    ) {
        if (result === 0) {
            this.statusType = ResponseTypeEnum.unknown;
        }
        else if (result === 500) {
            this.statusType = ResponseTypeEnum.internalServerError;
        }
        else if (result === 200) {
            this.statusType = ResponseTypeEnum.success;
        }
        else if (result === 403) {
            this.statusType = ResponseTypeEnum.forbidden;
        }
        else if (result === 400) {
            this.statusType = ResponseTypeEnum.badRequest;
        }
        else if (result === 404) {
            this.statusType = ResponseTypeEnum.notFound;
        }
        else
            this.statusType = ResponseTypeEnum.unknown;
    }
}