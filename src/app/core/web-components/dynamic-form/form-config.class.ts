import { Observable } from 'rxjs/Observable';
import { BaseField } from './base-field.class';
import { FormGroup } from '@angular/forms';
import { IItem } from '../../../repository/iitem.interface';
import { ResponseCreate, ResponseEdit } from '../../../repository/responses';
import { ErrorResponse, FormErrorResponse } from '../../../repository/error-responses';

export class FormConfig<TItem extends IItem>{

    public submitText: string;
    public fieldsLoader: () => Observable<BaseField<any>[]>;
    public insertFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>;
    public editFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>;
    public showSnackBar: boolean;
    public snackBarText: string;
    public insertCallback?: (response: ResponseCreate<TItem>) => void;
    public updateCallback?: (response: ResponseEdit<TItem>) => void;
    public errorCallback?: (response: ErrorResponse | FormErrorResponse) => void;

    constructor(
        config: {
            submitText: string,
            fieldsLoader: () => Observable<BaseField<any>[]>,
            showSnackBar?: boolean,
            snackBarText?: string,
            insertFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>, // insert or edit function needs to be provided
            editFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>, // insert or edit function needs to be provided
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            errorCallback?: (response: ErrorResponse | FormErrorResponse) => void;
        }
    ) {
        Object.assign(this, config);

        // assign default values
        this.snackBarText = config.snackBarText || "Uloženo";
        this.showSnackBar = config.showSnackBar || true;
        this.submitText = config.submitText || "Uložit";

    }

    public isInsertForm(): boolean {
        return this.insertFunction != null;
    }

    public isEditForm(): boolean {
        return this.editFunction != null;
    }
}