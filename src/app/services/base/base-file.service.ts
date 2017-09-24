import { Observable } from 'rxjs/Observable';
import {
   RepositoryClient, DeleteFileQuery, SingleFileQuery, MultipleFileQuery, UploadMultipleQuery, UploadSingleQuery
} from '../../../lib/repository';


export abstract class BaseFileService {

    /**
     * Name of the endpoint controller which is used as files endpoint
     */
    protected controller: string = 'file';

    constructor(
        protected repositoryClient: RepositoryClient,
    ) {
    }

    uploadSingleFile(action: string, file: File): UploadSingleQuery{
        return this.repositoryClient.uploadSingleFile(this.controller, action, file);
    }

    uploadMultipleFiles(action: string, files: File[]): UploadMultipleQuery {
        return this.repositoryClient.uploadMultipleFiles(this.controller, action, files);
    }

    singleFile(action: string): SingleFileQuery {
        return this.repositoryClient.singleFile(this.controller, action);
    }

    multipleFile(action: string): MultipleFileQuery {
        return this.repositoryClient.multipleFiles(this.controller, action);
    }

    deleteFile(action: string, fileUrl: string): DeleteFileQuery {
        return this.repositoryClient.deleteFile(this.controller, action, fileUrl);
    } 
}