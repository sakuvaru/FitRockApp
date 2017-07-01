import { Observable } from 'rxjs/RX';
import { FormGroup } from '@angular/forms';
import { BaseField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse } from '../../lib/repository';

export class FormConfig<TItem extends IItem>{

    public submitTextKey: string = 'form.shared.save'
    public fields: BaseField<any>[] = [];
    public insertFunction: (item: TItem) => Observable<ResponseCreate<TItem>>;
    public editFunction: (item: TItem) => Observable<ResponseEdit<TItem>>;
    public showSnackBar: boolean = true;
    public snackBarTextKey: string = 'form.shared.saved';
    public type: string;
    public item: TItem;
    public showFields: string[] = null;

    public onFormInit: () => void;
    public onFormLoaded: () => void;
    public onInsert: (response: ResponseCreate<TItem>) => void;
    public onUpdate: (response: ResponseEdit<TItem>) => void;
    public onError: (response: ErrorResponse | FormErrorResponse | any) => void;
    public onBeforeSave: () => void;
    public OnAfterSave: () => void;

    constructor(
        config?: {
            submitTextKey?: string,
            fields: BaseField<any>[],
            showSnackBar?: boolean,
            snackBarTextKey?: string,
            insertFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>, // insert or edit function needs to be provided
            editFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>, // insert or edit function needs to be provided
            type?: string,
            item?: TItem,
            showFields?: string[],
            onFormInit?: () => void,
            onFormLoaded?: () => void,
            onInsert?: (response: ResponseCreate<TItem>) => void,
            onUpdate?: (response: ResponseEdit<TItem>) => void,
            onError?: (response: ErrorResponse | FormErrorResponse | any) => void,
            onBeforeSave?: () => void;
            OnAfterSave?: () => void;
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