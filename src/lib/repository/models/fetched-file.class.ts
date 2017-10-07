export class FetchedFile {

    public fileName: string;
    public absoluteUrl: string;
    public fileNotFound: string;
    public fileSizeInBytes: number;
    public fileNameWithExtension: string;
    public fileLastModifiedHash: string;
    public fileLastModified: Date;

    constructor(
        options: {
            fileName: string,
            absoluteUrl: string,
            fileNotFound: string,
            fileSizeInBytes: number,
            fileNameWithExtension: string,
            fileLastModifiedHash: string,
            fileLastModified: Date
        }
    ) {
        Object.assign(this, options);
    }
}
