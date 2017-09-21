// common
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseWebComponent } from '../base-web-component.class';
import { FileRecordService } from '../../app/services';

// required by component
import { UploaderConfig } from './uploader.config';
import * as _ from 'underscore';

@Component({
    selector: 'uploader',
    templateUrl: 'uploader.component.html'
})
export class UploaderComponent extends BaseWebComponent implements OnInit, OnChanges {

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
     * Indicates if upload was successful
     */
    private uploadSuccessful: boolean = false;

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
     * List of accepted extensions, include '.' here as per https://teradata.github.io/covalent/#/components/file-upload
     */
    private acceptedExtensionsString: string;

    /**
    * List of accepted extensions, these are checked against selected files
    */
    private acceptedExtensions: string[];

    constructor(
        private translateService: TranslateService,
        private fileRecordService: FileRecordService
    ) {
        super()
    }

    @Input() config: UploaderConfig;

    ngOnInit() {
        if (this.config) {
            this.initUploader(this.config);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.config.currentValue) {
            this.initUploader(changes.config.currentValue);
        }
    }

    private initUploader(config: UploaderConfig): void {
        if (!config) {
            console.warn('Uploader could not be initialized');
            return;
        }

        this.config = config;

        // check that upload function is defined
        if (!config.uploadFunction) {
            console.warn('Uploader could not be initialized because upload function is not defined');
        }

        // init accepted extensions
        this.acceptedExtensions = this.getAcceptedExtensions(this.config);
        this.acceptedExtensionsString = this.getAcceptedExtensionsAsString(this.getAcceptedExtensions(this.config));

        // init max files
        if (this.config.maxUploadedFiles) {
            this.maxFiles = this.config.maxUploadedFiles;
        }
    }

    private getAcceptedExtensions(config: UploaderConfig): string[] {
        var allowedExtensions: string[] = [];

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

        var extensionsString: string = '';

        for (var i = 0; i < extensions.length; i++) {
            extensionsString += '.' + extensions[i];

            if (i !== extensions.length - 1) {
                extensionsString += ',';
            }
        }

        return extensionsString;
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

    uploadSingle(file: File): void {
        this.resetCounters();

        if (!file) {
            this.noFilesSelected = true;
            return;
        }

        if (!this.fileIsAllowed(file)) {
            this.extensionNotAllowed = true;
            this.extensionsNotAllowedParam.extensions = this.getListOfNotAllowedExtensions([file]);
            return;
        }

        try {
            this.config.uploadFunction(file)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(response => {
                    this.uploadSuccessful = true;

                    var uploadedFile: any[] = response.file ? [response.file] : [];

                    if (this.config.onAfterUpload) {
                        this.config.onAfterUpload(uploadedFile);
                    }

                    this.clearSelectedFiles();
                },
                error => {
                    this.uploadFailed = true;
                });
        }
        catch (error) {
            this.uploadFailed = true;

            if (this.config.onFailedUpload) {
                this.config.onFailedUpload(error);
            }
        }
    }

    uploadMultiple(file: any): void {
        this.resetCounters();

        if (!file) {
            this.noFilesSelected = true;
            return;
        }
        var files: File[] = [];

        // if multiple selection is used, but only 1 file is selected, it is returned directly
        if (file instanceof File) {
            files.push(file);
        }
        else {
            // this means multiple files were selected
            for (var i = 0; i < this.maxFiles; i++) {
                if (file[i]) {
                    files.push(file[i]);
                }
            }
        }

        if (files.length === 0) {
            this.noFilesSelected = true;
            return;
        }

        if (!this.allFilesAllowed(files)) {
            this.extensionNotAllowed = true;
            this.extensionsNotAllowedParam.extensions = this.getListOfNotAllowedExtensions(files);
            return;
        }

        try {
            this.config.uploadFunction(files)
                .takeUntil(this.ngUnsubscribe)
                .subscribe(response => {
                    this.uploadSuccessful = true;

                    if (this.config.onAfterUpload) {
                        this.config.onAfterUpload(response.files);
                    }

                    this.clearSelectedFiles();
                },
                error => {
                    this.uploadFailed = true;
                });
        }
        catch (error) {
            this.uploadFailed = true;

            if (this.config.onFailedUpload) {
                this.config.onFailedUpload(error);
            }
        }

    }

    private getListOfNotAllowedExtensions(files: File[]): string {
        if (!files) {
            return '';
        }

        if (!Array.isArray(files)) {
            return '';
        }

        var notAllowedExtensions: string = '';

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileAllowed = this.fileIsAllowed(file);
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
            var fileAllowed = this.fileIsAllowed(file);
            if (!fileAllowed) {
                return false;
            }
            return true;
        });

        // if we get here, all files are allowed
        return true;
    }

    private fileIsAllowed(file: File): boolean {
        var fileExtension = this.getFileExtension(file.name);

        if (!fileExtension) {
            return false;
        }

        fileExtension = fileExtension.toLowerCase();

        var isAllowedExtension = this.acceptedExtensions.find(m => m.toLowerCase() === fileExtension);

        if (isAllowedExtension) {
            return true;
        }
        return false;
    }

    private getFileExtension(fileName: string): string | null {
        var re = /(?:\.([^.]+))?$/;

        var result = re.exec(fileName);

        if (result && result[1]) {
            return result[1];
        }
        return null;
    }

    private clearSelectedFiles(): void{
        // currently the covalent will remove selected files if the control is disabled
        this.disabled = true;
        // not ideal, but only way to clear files at this moment
        setTimeout(() => this.disabled = false, 100);
    }

    private resetCounters(): void {
        this.uploadSuccessful = false;
        this.uploadFailed = false;
        this.noFilesSelected = false;
        this.extensionNotAllowed = false;
        this.extensionsNotAllowedParam.extensions = '';
    }
}