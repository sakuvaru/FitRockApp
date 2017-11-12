import { UploaderBuilder, UploaderModeEnum } from '../../../web-components/uploader';
import { Observable } from 'rxjs/Rx';

export class UploaderService {
    uploader(
        mode: UploaderModeEnum,
        uploadFunction: (files: File[] | File) => Observable<any>
    ) {
        return new UploaderBuilder(mode, uploadFunction);
    }
}
