import { Observable } from 'rxjs/RX';
import { FormGroup } from '@angular/forms';
import { BaseField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse, ResponseDelete } from '../../lib/repository';

export class FormConfig<TItem extends IItem>{

    public submitTextKey: string = 'form.shared.save';
    public deleteTextKey: string = 'form.shared.delete';
    public fields: BaseField<any>[] = [];
    public insertFunction: (item: any) => Observable<ResponseCreate<TItem>>;
    public editFunction: (item: any) => Observable<ResponseEdit<TItem>>;
    public deleteFunction: (item: any) => Observable<ResponseDelete>;

    public showSnackBar: boolean = true;
    public snackBarTextKey: string = 'form.shared.saved';
    public deleteSnackBarTextKey: string = 'form.shared.deleted';
    public type: string;
    public item: any;
    public hiddenFields: string[] = [];

    public onFormInit: () => void;
    public onFormLoaded: () => void;
    public onAfterInsert: (response: ResponseCreate<TItem>) => void;
    public onAfterUpdate: (response: ResponseEdit<TItem>) => void;
    public onError: (response: ErrorResponse | FormErrorResponse | any) => void;
    public onBeforeSave: () => void;
    public OnAfterSave: () => void;
    public onAfterDelete: (response: ResponseDelete) => void;
    public onBeforeDelete: (item: any) => void;

    constructor(
        config?: {
            submitTextKey?: string,
            fields: BaseField<any>[],
            showSnackBar?: boolean,
            snackBarTextKey?: string,
            insertFunction?: (item: any) => Observable<ResponseCreate<TItem>>, // insert or edit function needs to be provided
            editFunction?: (item: any) => Observable<ResponseEdit<TItem>>, // insert or edit function needs to be provided
            deleteFunction?: (item: any) => Observable<ResponseDelete>,
            type?: string,
            item?: TItem,
            hiddenFields?: string[],
            onFormInit?: () => void,
            onFormLoaded?: () => void,
            onAfterInsert?: (response: ResponseCreate<TItem>) => void,
            onAfterUpdate?: (response: ResponseEdit<TItem>) => void,
            onError?: (response: ErrorResponse | FormErrorResponse | any) => void,
            onBeforeSave?: () => void,
            OnAfterSave?: () => void,
            onBeforeDelete?: (item: any) => void
            onAfterDelete?: (response: ResponseDelete) => void
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

    public isDeleteForm(): boolean {
        return this.deleteFunction != null;
    }
}
