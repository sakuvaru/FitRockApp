import { UploaderModeEnum } from './uploader-mode.enum';
import { UploaderConfig } from './uploader.config';
import { ResponseUpload } from './uploader-models';
import { Observable } from 'rxjs/Rx';
import { ResponseUploadMultiple, ResponseUploadSingle } from '../../lib/repository';

export class UploaderBuilder {

    public config: UploaderConfig;

    constructor(
        /**
         * Mode of the uploader
         */
        private mode: UploaderModeEnum,
        /**
         * Method responsible for uploading file || files
         */
        private upload: (files: File[] | File) => Observable<ResponseUploadSingle | ResponseUploadMultiple>
    ) {

        // map response for upload component
        const mappedUpload = (files: File[] | File) => this.upload(files).map(response => {
            if (response instanceof ResponseUploadSingle) {
                return new ResponseUpload([response.file]);
            }

            if (response instanceof ResponseUploadMultiple) {
                return new ResponseUpload([response.files]);
            }

            throw Error (`Unsupported response type`);
        });

        this.config = new UploaderConfig(
            mappedUpload,
            mode
        );
    }

    /**
    * Indicates if List of default file extensions are allowed
    */
    useDefaultFileExtensions(useExtensions: boolean): this {
        this.config.useDefaultFileExtensions = useExtensions;
        return this;
    }

    /**
    * Indicates if List of default image extensions are allowed
    */
    useDefaultImageExtensions(useExtensions: boolean): this {
        this.config.useDefaultImageExtensions = useExtensions;
        return this;
    }

    /**
     * Maximum number of uploaded fiels, only applicable when multiple files mode is used
     */
    maxUploadedFiles(count: number): this {
        this.config.maxUploadedFiles = count;
        return this;
    }

    /**
     * List of extensions that are accepted.
     * Use extensions without dot '.'
     * 
     */
    allowedExtensions(extensions: string[]): this {
        this.config.allowedExtensions = extensions;
        return this;
    }

    /**
     * Callback for when items are uploaded
     */
    onAfterUpload<T>(callback: (uploadedItems: T[]) => void): this {
        this.config.onAfterUpload = callback;
        return this;
    }

    /**
     * Callback for when upload fails
     */
    onFailedUpload(callback: (error: any) => void): this {
        this.config.onFailedUpload = callback;
        return this;
    }

    /**
     * Callback for selecting file or files
     */
    onSelectFiles(callback: (files: FileList | File) => void): this {
        this.config.onSelectFiles = callback;
        return this;
    }

    /**
     * Builds config
     */
    build(): UploaderConfig {
        return this.config;
    }
}
