// common
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';

// required by component
import { UploaderConfig } from './uploader.config';
import * as _ from 'underscore';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject } from 'rxjs/Rx';

@Component({
    selector: 'uploader',
    templateUrl: 'uploader.component.html'
})
export class UploaderComponent extends BaseWebComponent implements OnInit, OnChanges {

    /**
     * Subject for triggering upload actions
     */
    private uploadButtonSubject = new Subject<File[] | File>();

    /**
     * Maximum number of uploaded files
     * Can be overridden with config
     */
    private maxFiles: number = 10;

    /**
     * Indicates if component is disabled
     */
    private disabled: boolean = false;

    /**
     * Indicates if no files were selected
     */
    private noFilesSelected: boolean = false;

    /**
     * Indicates if upload failed
     */
    private uploadFailed: boolean = false;

    /**
     * Indicates if upload fails because some of the files contain unsupported extension
     */
    private extensionNotAllowed: boolean = false;

    /**
     * This can contain a list of not allowed extensions when upload fails due to unsupported extensions
     */
    private extensionsNotAllowedParam: any = {};

     /**
     * Max files param for translation
     */
    private get maxFilesParam(): any {
        const param: any = {};
        param.maxFiles = this.maxFiles;

        return param;
    }

    /**
     * List of accepted extensions, include '.' here as per https://teradata.github.io/covalent/#/components/file-upload
     */
    private acceptedExtensionsString: string;

    /**
    * List of accepted extensions, these are checked against selected files
    */
    private acceptedExtensions: string[];

    /**
     * Duration which the snackbar is visible
     */
    private readonly snackbarDefaultDuration: number = 2500;

    /**
     * Indicates if loader is enabled
     */
    private loaderEnabled: boolean = false;

    /**
    * Flag for initialization component, used because ngOnChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    public initialized = false;

    private translations = {
        'snackbarUploadedText': ''
    };

    constructor(
        private localizationService: LocalizationService,
        private snackBarService: MatSnackBar,
    ) {
        super();
    }

    @Input() config: UploaderConfig;

    ngOnInit() {
        this.initUploader();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initUploader();
    }

    selectEvent(file: File | FileList): void {
        if (this.config.onSelectFiles) {
            this.config.onSelectFiles(file);
        }
    }

    cancelEvent(): void {
    }

    toggleDisabled(): void {
        this.disabled = !this.disabled;
    }

    handleUploadSingle(file: File): void {
        this.uploadButtonSubject.next(file);
    }

    handleUploadMultiple(files: File[]): void {
        this.uploadButtonSubject.next(files);
    }

    private initUploader(): void {
        if (!this.config && !this.initialized) {
            return;
        }

        this.initialized = true;

        // subscribe to upload button
        this.subscribeToUploadButtons();

        // init translations
        this.initTranslations();

        // check that upload function is defined
        if (!this.config.uploadFunction) {
            throw Error('Uploader could not be initialized because upload function is not defined');
        }

        // init accepted extensions
        this.acceptedExtensions = this.getAcceptedExtensions(this.config);
        this.acceptedExtensionsString = this.getAcceptedExtensionsAsString(this.getAcceptedExtensions(this.config));

        // init max files
        if (this.config.maxUploadedFiles) {
            this.maxFiles = this.config.maxUploadedFiles;
        }
    }

    private subscribeToUploadButtons() {
        this.uploadButtonSubject
            .do(() => {
                this.loaderEnabled = true;
                this.resetCounters();
            })
            .switchMap((fileInput) => {
                if (fileInput instanceof File) {
                    return this.uploadSingle(fileInput);
                }

                if (fileInput instanceof FileList) {
                    return this.uploadMultiple(fileInput);
                }

                throw Error(`Unsupported upload type`);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe((files) => {
                if (this.config.onAfterUpload) {
                    this.config.onAfterUpload(files);
                }

                this.clearSelectedFiles();

                this.snackBarService.open(this.translations.snackbarUploadedText, undefined, { duration: this.snackbarDefaultDuration });

                this.loaderEnabled = false;
            },
            error => {
                this.uploadFailed = true;

                this.loaderEnabled = false;

                if (this.config.onFailedUpload) {
                    this.config.onFailedUpload(error);
                }
            });
    }

    private initTranslations(): void {
        this.localizationService.get('webComponents.uploader.uploaded').subscribe(result => this.translations.snackbarUploadedText = result);
    }

    private getAcceptedExtensions(config: UploaderConfig): string[] {
        let allowedExtensions: string[] = [];

        // add default extensions if allowed
        if (config.useDefaultFileExtensions) {
            allowedExtensions = _.union(allowedExtensions, config.defaultFileExtensions);
        }

        // add default extensions if allowed
        if (config.useDefaultImageExtensions) {
            allowedExtensions = _.union(allowedExtensions, config.defaultImageExtensions);
        }

        if (!config.allowedExtensions || !Array.isArray(config.allowedExtensions)) {
            return allowedExtensions;
        }

        allowedExtensions = _.union(allowedExtensions, config.allowedExtensions);

        return allowedExtensions;
    }

    private getAcceptedExtensionsAsString(extensions: string[]): string {
        if (!extensions || !Array.isArray(extensions)) {
            return '';
        }

        let extensionsString: string = '';

        for (let i = 0; i < extensions.length; i++) {
            extensionsString += '.' + extensions[i];

            if (i !== extensions.length - 1) {
                extensionsString += ',';
            }
        }

        return extensionsString;
    }

    private uploadSingle(file: File): Observable<any[]> {
        if (!file) {
            this.noFilesSelected = true;
            return Observable.of();
        }

        if (!this.fileIsAllowed(file)) {
            this.extensionNotAllowed = true;
            this.extensionsNotAllowedParam.extensions = this.getListOfNotAllowedExtensions([file]);
            return Observable.of();
        }

        return this.config.uploadFunction(file)
            .map(response => {
                if (response.files && response.files.length === 1) {
                    return response.files;
                }

                throw new Error(`Unexpected upload result. Multiple files were received even though only 1 file was expected.`);
            });
    }

    private uploadMultiple(file: FileList): Observable<any[]> {
        if (!file) {
            this.noFilesSelected = true;
            return Observable.of();
        }
        const files: File[] = [];

        // if multiple selection is used, but only 1 file is selected, it is returned directly
        if (file instanceof File) {
            files.push(file);
        } else {
            // this means multiple files were selected
            for (let i = 0; i < this.maxFiles; i++) {
                if (file[i]) {
                    files.push(file[i]);
                }
            }
        }

        if (files.length === 0) {
            this.noFilesSelected = true;
            return Observable.of();
        }

        if (!this.allFilesAllowed(files)) {
            this.extensionNotAllowed = true;
            this.extensionsNotAllowedParam.extensions = this.getListOfNotAllowedExtensions(files);
            return Observable.of();
        }

        return this.config.uploadFunction(files)
            .map(response => {
                return response.files;
            });
    }

    private getListOfNotAllowedExtensions(files: File[]): string {
        if (!files) {
            return '';
        }

        if (!Array.isArray(files)) {
            return '';
        }

        let notAllowedExtensions: string = '';

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileAllowed = this.fileIsAllowed(file);
            if (!fileAllowed) {
                notAllowedExtensions += this.getFileExtension(file.name);

                if (i !== files.length - 1) {
                    notAllowedExtensions += ', ';
                }
            }
        }
        return notAllowedExtensions;
    }

    private allFilesAllowed(files: File[]): boolean {
        if (!files) {
            return false;
        }

        if (!Array.isArray(files)) {
            return false;
        }

        files.forEach(file => {
            const fileAllowed = this.fileIsAllowed(file);
            if (!fileAllowed) {
                return false;
            }
            return true;
        });

        // if we get here, all files are allowed
        return true;
    }

    private fileIsAllowed(file: File): boolean {
        let fileExtension = this.getFileExtension(file.name);

        if (!fileExtension) {
            return false;
        }

        fileExtension = fileExtension.toLowerCase();

        const isAllowedExtension = this.acceptedExtensions.find(m => m.toLowerCase() === fileExtension);

        if (isAllowedExtension) {
            return true;
        }
        return false;
    }

    private getFileExtension(fileName: string): string | null {
        const re = /(?:\.([^.]+))?$/;

        const result = re.exec(fileName);

        if (result && result[1]) {
            return result[1];
        }
        return null;
    }

    private clearSelectedFiles(): void {
        // currently the covalent will remove selected files if the control is disabled
        this.disabled = true;
        // not ideal, but only way to clear files at this moment
        setTimeout(() => this.disabled = false, 100);
    }

    private resetCounters(): void {
        this.uploadFailed = false;
        this.noFilesSelected = false;
        this.extensionNotAllowed = false;
        this.extensionsNotAllowedParam.extensions = '';
    }
}
