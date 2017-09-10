// common
import { Component, Input, Output, EventEmitter, ViewContainerRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseWebComponent } from '../base-web-component.class';
import { FileRecordService } from '../../app/services';

@Component({
    selector: 'uploader',
    templateUrl: 'uploader.component.html'
})
export class UploaderComponent extends BaseWebComponent implements OnInit {

    private titleText: string;
    private maxFiles: number = 10;

    constructor(
        private translateService: TranslateService,
        private fileRecordService: FileRecordService
    ) {
        super()
    }

    @Input() color: 'none' | 'warn' | 'accent' | 'primary' = 'none';

    @Output() confirm = new EventEmitter();

    ngOnInit() {
    }

    fileSelectMsg: string = 'No file selected yet.';
    fileUploadMsg: string = 'No file uploaded yet.';
    disabled: boolean = false;

    selectEvent(file: File): void {
        this.fileSelectMsg = file.name;
    }

    cancelEvent(): void {
        this.fileSelectMsg = 'No file selected yet.';
        this.fileUploadMsg = 'No file uploaded yet.';
    }

    toggleDisabled(): void {
        this.disabled = !this.disabled;
    }

    uploadEvent(file: File): void {
        this.fileRecordService.uploadAvatar(file, 1).set().subscribe(response => console.log(response));
    }

    uploadEvent2(file: any): void {
        var files: File[] = [];

        if (!file){
            console.log('No file was selected');
            return;
        }

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

        this.fileRecordService.uploadGalleryImages(files, 1).set().subscribe(response => console.log(response));
    }
}