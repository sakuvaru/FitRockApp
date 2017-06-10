import { Observable } from 'rxjs/Observable';
import { BaseField } from './base-field.class';
import { FormGroup } from '@angular/forms';
import { IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse  } from '../../repository';

export class FormConfig<TItem extends IItem>{

    public submitTextKey: string;
    public fieldsLoader: () => Observable<BaseField<any>[]>;
    public insertFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>;
    public editFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>;
    public showSnackBar: boolean;
    public snackBarTextKey: string;
    public insertCallback?: (response: ResponseCreate<TItem>) => void;
    public updateCallback?: (response: ResponseEdit<TItem>) => void;
    public errorCallback?: (response: ErrorResponse | FormErrorResponse | any) => void;

    constructor(
        config: {
            submitTextKey: string,
            fieldsLoader: () => Observable<BaseField<any>[]>,
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

        // assign default values
        this.snackBarTextKey = config.snackBarTextKey || 'form.shared.saved';
        this.showSnackBar = config.showSnackBar || true;
        this.submitTextKey = config.submitTextKey || "form.shared.save";

    }

    public isInsertForm(): boolean {
        return this.insertFunction != null;
    }

    public isEditForm(): boolean {
        return this.editFunction != null;
    }
}