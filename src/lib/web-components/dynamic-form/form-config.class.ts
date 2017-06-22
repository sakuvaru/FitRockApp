import { Observable } from 'rxjs/RX';
import { FormGroup } from '@angular/forms';
import { BaseField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse  } from '../../repository';

export class FormConfig<TItem extends IItem>{

    public submitTextKey: string = 'form.shared.save'
    public fields: BaseField<any>[];
    public insertFunction: (item: TItem) => Observable<ResponseCreate<TItem>>;
    public editFunction: (item: TItem) => Observable<ResponseEdit<TItem>>;
    public showSnackBar: boolean = true;
    public snackBarTextKey: string = 'form.shared.saved';
    public insertCallback: (response: ResponseCreate<TItem>) => void;
    public updateCallback: (response: ResponseEdit<TItem>) => void;
    public errorCallback: (response: ErrorResponse | FormErrorResponse | any) => void;
    public type: string;
    public item: TItem;

    constructor(
        config?: {
            submitTextKey?: string,
            fields: BaseField<any>[],
            showSnackBar?: boolean,
            snackBarTextKey?: string,
            insertFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>, // insert or edit function needs to be provided
            editFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>, // insert or edit function needs to be provided
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            errorCallback?: (response: ErrorResponse | FormErrorResponse | any) => void,
            type?: string,
            item?: TItem
        }
    ) {
        Object.assign(this, config);
    }

    public isInsertForm(): boolean {
        return this.insertFunction != null;
    }

    public isEditForm(): boolean {
        return this.editFunction != null;
    }
}