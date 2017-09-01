import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';
import { DataModel } from '../extra/data-model.class';

export class Feed extends BaseItem {
    public feedUserId: number;
    public markedAsRead: boolean;
    public feedType: string;
    public dataList: DataModel[];
    public feedUser: User;
}

