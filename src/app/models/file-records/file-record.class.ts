import { BaseItem } from '../../../lib/repository';

export class FileRecord extends BaseItem {
    public fileName: string;
    public filePath: string;
    public sizeInBytes: number;
    public extension: string;
    public fileRecordType: string;
    public fileUrl: string;
    public folderPath: string;
}