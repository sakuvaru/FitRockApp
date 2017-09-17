import { UploaderModeEnum } from './uploader-mode.enum';
import { Observable } from 'rxjs/Rx';

export class UploaderConfig {
    
    /**
    * List of default file extensions
    */
    public readonly defaultFileExtensions: string[] = ['txt', 'jpg', 'jpeg', 'gif', 'png', 'bmp', 'doc', 'docx', 'xls', 'xlxs'];
    
    /**
    * List of default image extensions
    */
    public readonly defaultImageExtensions: string[] = ['jpg', 'jpeg', 'gif', 'png'];

    /**
    * Function responsible for uploading files
    */
    public uploadFunction: (files: FileList | File) => Observable<any>;

    /**
     * Mode of the uploader
     */
    public mode: UploaderModeEnum;

    /**
    * Indicates if List of default extensions are allowed
    */
    public useDefaultFileExtensions: boolean = false;

    /**
    * Indicates if List of default image extensions are allowed
    */
    public useDefaultImageExtensions: boolean = false;

    /**
     * Maximum number of uploaded fiels, only applicable when multiple files mode is used
     */
    public maxUploadedFiles: number;

    /**
     * List of extensions that are accepted.
     * Use extensions without dot '.'
     * 
     */
    public allowedExtensions?: string[];

    /**
     * Callback for when items are uploaded
     */
    public onAfterUpload?: <T>(uploadedItems: T[] | T) => void;

    /**
     * Callback for when upload fails
     */
    public onFailedUpload?: (error: any) => void;

    /**
     * Callback for selecting file or files
     */
    public onSelectFiles?: (files: FileList | File) => void;

    constructor(
        options: {
            // required
            mode: UploaderModeEnum,
            uploadFunction: (files: FileList | File) => Observable<any>,

            // optional
            useDefaultFileExtensions?: boolean,
            useDefaultImageExtensions?: boolean,
            onAfterUpload?: <T>(uploadedItems: T[] | T) => void,
            onFailedUpload?: () => void,
            onSelectFiles?: (files: FileList | File) => void,
            maxUploadedFiles?: number
        }
    ) {
        Object.assign(this, options);
    }
}