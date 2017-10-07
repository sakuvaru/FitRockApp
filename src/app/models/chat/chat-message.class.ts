import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';

export class ChatMessage extends BaseItem {
    public message: string;
    public senderUserId: number;
    public recipientUserId: number;

    public sender: User;
    public recipient: User;
}
