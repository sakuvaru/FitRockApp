import { BaseItem } from '../../../lib/repository';

export class FileRecord extends BaseItem {
    public filename: string;
    public filepath: string;
    public sizeInBytes: number;
    public extension: string;
    public fileRecordType: string;
}