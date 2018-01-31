import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject } from 'rxjs/Rx';
import * as _ from 'underscore';

import { LocalizationService } from '../../lib/localization';
import { BaseWebComponent } from '../base-web-component.class';
import { UploaderModeEnum } from './uploader-mode.enum';
import { UploaderConfig } from './uploader.config';

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
    public maxFiles: number = 10;

    /**
     * Indicates if component is disabled
     */
    public disabled: boolean = false;

    /**
     * Indicates if no files were selected
     */
    public noFilesSelected: boolean = false;

    /**
     * Indicates if upload failed
     */
    public uploadFailed: boolean = false;

    /**
     * Indicates if upload fails because some of the files contain unsupported extension
     */
    public extensionNotAllowed: boolean = false;

    /**
     * This can contain a list of not allowed extensions when upload fails due to unsupported extensions
     */
    public extensionsNotAllowedParam: any = {};

    /**
    * Max files param for translation
    */
    public get maxFilesParam(): any {
        const param: any = {};
        param.maxFiles = this.maxFiles;

        return param;
    }

    /**
     * List of accepted extensions, include '.' here as per https://teradata.github.io/covalent/#/components/file-upload
     */
    public acceptedExtensionsString: string;

    /**
    * List of accepted extensions, these are checked against selected files
    */
    public acceptedExtensions: string[];

    /**
     * Duration which the snackbar is visible
     */
    private readonly snackbarDefaultDuration: number = 2500;

    /**
     * Indicates if loader is enabled
     */
    public loaderEnabled: boolean = false;

    /**
    * Flag for initialization component, used because ngOnChanges can be called before ngOnInit
    * which would cause component to be initialized twice (happened when component is inside a dialog)
    * Info: https://stackoverflow.com/questions/43111474/how-to-stop-ngonchanges-called-before-ngoninit/43111597
    */
    public initialized = false;

    private translations = {
        'snackbarUploadedText': ''
    };

    /**
     * Indicates if uploader box is dragged over
     */
    public isDraggedOver: boolean = false;

    /**
     * Used for keepign the drag over child elements
     * https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
     */
    public dragCounter: number = 0;

    public get applyDragOverClass(): boolean {
        return this.dragCounter === 0;
    }

    public selectedFiles?: FileList;
    public selectedFile?: File;

    @Input() config: UploaderConfig;

    constructor(
        private localizationService: LocalizationService,
        private snackBarService: MatSnackBar
    ) {
        super();
    }

    ngOnInit() {
        this.initUploader();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initUploader();
    }

    selectEvent(fileOrFiles: File | FileList): void {
        if (this.config.onSelectFiles) {
            this.config.onSelectFiles(fileOrFiles);
        }

        this.selectedFiles = undefined;
        this.selectedFile = undefined;

        if (fileOrFiles instanceof File) {
            this.selectedFile = fileOrFiles;
        }

        if (fileOrFiles instanceof FileList) {
            this.selectedFiles = fileOrFiles;
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

    dragEnter(event: any): void {
        event.preventDefault();
        this.dragCounter++;
        this.isDraggedOver = true;
    }

    dragLeave(event: any): void {
        event.preventDefault();
        this.dragCounter--;
        if (this.dragCounter === 0) {
            this.isDraggedOver = false;
        }
    }

    drop(event: any): void {
        event.preventDefault();
        this.dragCounter = 0;
        this.isDraggedOver = false;
    }

    uploadSingle(file: File): Observable<any[] | boolean> {
        if (!file) {
            this.noFilesSelected = true;
            return Observable.of(false);
        }

        if (!this.fileIsAllowed(file)) {
            this.extensionNotAllowed = true;
            this.extensionsNotAllowedParam.extensions = this.getListOfNotAllowedExtensions([file]);
            return Observable.of(false);
        }

        return this.config.uploadFunction(file)
            .map(response => {
                if (response.files && response.files.length === 1) {
                    return response.files;
                }

                throw new Error(`Unexpected upload result. Multiple files were received even though only 1 file was expected.`);
            });
    }

    uploadMultiple(files: File[]): Observable<any[] | boolean> {
        if (!files || files.length === 0) {
            this.noFilesSelected = true;
            return Observable.of(false);
        }

        if (!this.allFilesAllowed(files)) {
            this.extensionNotAllowed = true;
            this.extensionsNotAllowedParam.extensions = this.getListOfNotAllowedExtensions(files);
            return Observable.of(false);
        }

        return this.config.uploadFunction(files)
            .map(response => {
                return response.files;
            });
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
                if (this.config.mode === UploaderModeEnum.SingleFile) {
                    if (!(fileInput instanceof File)) {
                        throw Error(`Single file upload expected 'File' input`);
                    }
                    return this.uploadSingle(fileInput);
                }

                if (this.config.mode === UploaderModeEnum.MultipleFiles) {
                    const files: File[] = [];

                    if (fileInput instanceof FileList) {
                        for (let i = 0; i < this.maxFiles; i++) {
                            if (fileInput[i]) {
                                files.push(fileInput[i]);
                            }
                        }
                    } else if (fileInput instanceof File) {
                        files.push(fileInput);
                    } else {
                        throw Error(`Unexpected file input`);
                    }

                    return this.uploadMultiple(files);
                }

                throw Error(`Unsupported upload type`);
            })
            .takeUntil(this.ngUnsubscribe)
            .subscribe((files) => {
                if (!files) {
                    // upload was not successful - no selected file, invalid extension etc.
                    this.loaderEnabled = false;
                } else if (files && Array.isArray(files)) {
                    if (this.config.onAfterUpload) {
                        this.config.onAfterUpload(files);
                    }

                    this.clearSelectedFiles();

                    this.snackBarService.open(this.translations.snackbarUploadedText, undefined, { duration: this.snackbarDefaultDuration });

                    this.loaderEnabled = false;
                }
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
