import { UploaderBuilder, UploaderModeEnum } from '../../../web-components/uploader';
import { Observable } from 'rxjs/Rx';
import { ResponseUploadMultiple, ResponseUploadSingle } from '../../../lib/repository';

export class UploaderService {

    singleUpload(
        upload: (files: File[] | File) => Observable<ResponseUploadSingle>
    ) {
        return new UploaderBuilder(UploaderModeEnum.SingleFile, upload);
    }

    multipleUpload(
        upload: (files: File[] | File) => Observable<ResponseUploadMultiple>
    ) {
        return new UploaderBuilder(UploaderModeEnum.MultipleFiles, upload);
    }
}
