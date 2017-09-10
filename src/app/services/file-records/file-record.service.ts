import { Injectable } from '@angular/core';
import { FileRecord } from '../../models';
import { RepositoryClient, UploadSingleQuery, UploadMultipleQuery } from '../../../lib/repository';
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
            allowDelete: true
        })
    }

    uploadAvatar(file: File, userId: number): UploadSingleQuery<FileRecord>{
        return super.uploadSingleFile<FileRecord>('uploadAvatar/' + userId, file);
    }

    uploadGalleryImages(files: File[], userId: number): UploadMultipleQuery<FileRecord>{
        return super.uploadMultipleFiles<FileRecord>('uploadGalleryImages/' + userId, files);
    }
}