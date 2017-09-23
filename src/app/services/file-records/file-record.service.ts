import { Injectable } from '@angular/core';
import { FileRecord } from '../../models';
import { RepositoryClient, UploadSingleQuery, UploadMultipleQuery, MultipleFileQuery, 
    DeleteFileQuery, SingleFileQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

import { Observable } from 'rxjs/Rx';

// file upload 
import { TdFileService, IUploadOptions } from '@covalent/core';
import { CovalentFileModule } from '@covalent/core';
import { TokenService } from '../../../lib/auth';

@Injectable()
export class FileRecordService extends BaseTypeService<FileRecord>{

    constructor(
        protected repositoryClient: RepositoryClient,
        private tokenService: TokenService,
        private fileUploadService: TdFileService
    ) {
        super(repositoryClient, {
            type: 'FileRecord',
            allowDelete: false
        })
    }

    deleteFile(fileUrl: string): DeleteFileQuery {
        return super.deleteFile('deleteFile', fileUrl);
    }

    getAvatar(userId: number): SingleFileQuery {
        return super.singleFile('getAvatar/' + userId);
    }

    getGalleryFiles(userId: number): MultipleFileQuery {
        return super.multipleFile('getGalleryFiles/' + userId);
    }

    uploadAvatar(file: File, userId: number): UploadSingleQuery<FileRecord> {
        return super.uploadSingleFile<FileRecord>('uploadAvatar/' + userId, file);
    }

    uploadGalleryImages(files: File[], userId: number): UploadMultipleQuery<FileRecord> {
        return super.uploadMultipleFiles<FileRecord>('uploadGalleryImages/' + userId, files);
    }
}