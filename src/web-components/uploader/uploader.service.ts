import { UploaderBuilder } from './uploader-builder';
import { UploaderModeEnum } from './uploader-mode.enum';
import { Observable } from 'rxjs/Rx';

export class UploaderService {
    uploader(
        mode: UploaderModeEnum,
        uploadFunction: (files: FileList | File) => Observable<any>
    ) {
        return new UploaderBuilder(mode, uploadFunction);
    }
}