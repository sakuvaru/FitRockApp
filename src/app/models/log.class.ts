import { BaseItem } from '../../lib/repository';

export class Log extends BaseItem {

    public user: string;
    public stacktrace: string;
    public errorMessage: string;
}