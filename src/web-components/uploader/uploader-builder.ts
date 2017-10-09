import { UploaderModeEnum } from './uploader-mode.enum';
import { UploaderConfig } from './uploader.config';
import { Observable } from 'rxjs/Rx';

export class UploaderBuilder {

    private config: UploaderConfig;

    constructor(
        /**
         * Mode of the uploader
         */
        public mode: UploaderModeEnum,
        /**
         * Method responsible for uploading file || files
         */
        uploadFunction: (files: File[] | File) => Observable<any>
    ) {
        this.config = new UploaderConfig({
            mode: this.mode,
            uploadFunction: uploadFunction
        });
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
     * Global loader for the component
     * @param start Start function
     * @param stop Stop function
     */
    loaderConfig(start: () => void, stop: () => void): this {
        this.config.loaderConfig = { start: start, stop: stop };
        return this;
    }

    /**
     * Builds config
     */
    build(): UploaderConfig {
        return this.config;
    }
}
