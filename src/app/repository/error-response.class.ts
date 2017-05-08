import { ResponseTypeEnum } from './response-type.enum';

export class ErrorResponse {

    public statusType: ResponseTypeEnum;

    constructor(
        public errorMessage: string,
        public statusCode: number,
    ) {
        if (statusCode === 0) {
            this.statusType = ResponseTypeEnum.unknown;
        }
        else if (statusCode === 500) {
            this.statusType = ResponseTypeEnum.unknown;
        }
        else if (statusCode === 200) {
            this.statusType = ResponseTypeEnum.unknown;
        }
        else if (statusCode === 403) {
            this.statusType = ResponseTypeEnum.unknown;
        }
        else if (statusCode === 400) {
            this.statusType = ResponseTypeEnum.unknown;
        }
        else if (statusCode === 404) {
            this.statusType = ResponseTypeEnum.notFound;
        }
        else
            this.statusType = ResponseTypeEnum.unknown;
    }
}