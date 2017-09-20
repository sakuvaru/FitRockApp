export interface IFetchedFile{
    fileName: string;
    absoluteUrl: string;
    fileNotFound: string;
    fileSizeInBytes: number;
    fileNameWithExtension: string;
    fileLastModifiedHash: string;
}