export class FetchedFile {

    public fileName: string;
    public absoluteUrl: string;
    public fileNotFound: string;
    public fileSizeInBytes: number;
    public fileNameWithExtension: string
    public fileLastModifiedHash: string;

    constructor(
        options: {
            fileName: string,
            absoluteUrl: string,
            fileNotFound: string,
            fileSizeInBytes: number,
            fileNameWithExtension: string,
            fileLastModifiedHash: string
        }
    ) {
        Object.assign(this, options);
    }
}