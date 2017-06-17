import { Observable } from 'rxjs/RX';
import { BaseField } from './base-field.class';
import { FormGroup } from '@angular/forms';
import { IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse  } from '../../repository';

export class FormConfig<TItem extends IItem>{

    public submitTextKey: string = 'form.shared.save'
    public fieldsLoader: () => Observable<BaseField<any>[]>;
    public insertFunction: (item: TItem) => Observable<ResponseCreate<TItem>>;
    public editFunction: (item: TItem) => Observable<ResponseEdit<TItem>>;
    public showSnackBar: boolean = true;
    public snackBarTextKey: string = 'form.shared.saved';
    public insertCallback: (response: ResponseCreate<TItem>) => void;
    public updateCallback: (response: ResponseEdit<TItem>) => void;
    public errorCallback: (response: ErrorResponse | FormErrorResponse | any) => void;

    constructor(
        config?: {
            submitTextKey?: string,
            fieldsLoader?: () => Observable<BaseField<any>[]>,
            showSnackBar?: boolean,
            snackBarTextKey?: string,
            insertFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>, // insert or edit function needs to be provided
            editFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>, // insert or edit function needs to be provided
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            errorCallback?: (response: ErrorResponse | FormErrorResponse | any) => void;
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