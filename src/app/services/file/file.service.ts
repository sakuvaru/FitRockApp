import { Injectable } from '@angular/core';

import {
    RepositoryClient, UploadSingleQuery, UploadMultipleQuery, MultipleFileQuery,
    DeleteFileQuery, SingleFileQuery
} from '../../../lib/repository';
import { BaseFileService } from '../base/base-file.service';

@Injectable()
export class FileService extends BaseFileService {

    constructor(
        protected repositoryClient: RepositoryClient,
    ) {
        super(repositoryClient);
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

    uploadAvatar(file: File, userId: number): UploadSingleQuery {
        return super.uploadSingleFile('uploadAvatar/' + userId, file);
    }

    uploadGalleryImages(files: File[], userId: number): UploadMultipleQuery {
        return super.uploadMultipleFiles('uploadGalleryImages/' + userId, files);
    }
}
