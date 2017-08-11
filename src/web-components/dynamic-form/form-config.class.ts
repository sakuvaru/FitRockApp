import { Observable } from 'rxjs/RX';
import { FormGroup } from '@angular/forms';
import { BaseField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse, ResponseDelete } from '../../lib/repository';

export class FormConfig<TItem extends IItem>{

    /**
     * Key of submit text button
     */
    public submitTextKey: string = 'form.shared.save';

    /** 
     * Key of delete text button
    */
    public deleteTextKey: string = 'form.shared.delete';

    /**
     * List of fields (questions) assigned to the form
     */
    public fields: BaseField<any>[] = [];

    /**
     * Function to be executed on insert of new item in the form
     */
    public insertFunction: (item: any) => Observable<ResponseCreate<TItem>>;

    /**
     * Function to be executed on edit/update action og existing item in the form
     */
    public editFunction: (item: any) => Observable<ResponseEdit<TItem>>;

    /**
     * Function to be executed when deleting an existing item in the form
     */
    public deleteFunction: (item: any) => Observable<ResponseDelete>;

    /**
     * Indicates if snackbar is shown after save
     */
    public showSnackBar: boolean = true;

    /**
     * Key of the text shown in snackbar after inserting/saving item
     */
    public snackBarTextKey: string = 'form.shared.saved';

    /**
     * Key of the text shown in snackbar after successfully deleting an item
     */
    public deleteSnackBarTextKey: string = 'form.shared.deleted';

    /**
     * Type of the item in the form. This equals to the 'Codename' of the type. 
     * For example, workouts are defined as 'Workout' type.
     */
    public type: string;

    /**
     * Item loaded in the form
     */
    public item: any;

    /**
     * List of fields that are hidden and should not be shown in the form
     */
    public hiddenFields: string[] = [];

    /**
     * Callback when initializing the form
     */
    public onFormInit: () => void;

    /**
     * Callback for when the form has 'config' available. This is useful when the fields are loaded from server
     * rather then defined manually. It is called after 'onFormInit'.
     */
    public onFormLoaded: () => void;

    /**
     * Callback after a new item is successfully inserted
     */
    public onAfterInsert: (response: ResponseCreate<TItem>) => void;

    /**
     * Callback after an existing item was saved
     */
    public onAfterUpdate: (response: ResponseEdit<TItem>) => void;

    /**
     * Callback for handling errors
     */
    public onError: (response: ErrorResponse | FormErrorResponse | any) => void;

    /**
     * Callback before both updating or inserting an item in the form
     */
    public onBeforeSave: () => void;

    /**
     * Callback after an item was inserted on updated/edited
     */
    public OnAfterSave: () => void;

    /**
     * Callback after deleting an item
     */
    public onAfterDelete: (response: ResponseDelete) => void;

    /**
     * Callback before deleting an item
     */
    public onBeforeDelete: (item: any) => void;

     /**
     * Called when a value in a field changes
     */
    public onFieldValueChange: (config: FormConfig<TItem>, changedField: BaseField<any>, newValue: any) => void;

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
            onAfterDelete?: (response: ResponseDelete) => void,
            onFieldValueChange?: (config: FormConfig<TItem>, changedField: BaseField<any>, newValue: any) => void;
        }
    ) {
        Object.assign(this, config);
    }

    /**
     * Indicates if current form is insert form
     */
    public isInsertForm(): boolean {
        return this.insertFunction != null;
    }

    /**
     * Indicates if the current form is edit form
     */
    public isEditForm(): boolean {
        return this.editFunction != null;
    }

    /**
     * Indicates if current form supports deletion
     */
    public isDeleteForm(): boolean {
        return this.deleteFunction != null;
    }
}
