import { Observable } from 'rxjs/RX';
import { FormGroup } from '@angular/forms';
import { ResponseFormInsert, ResponseFormEdit, FormField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse, ResponseDelete } from '../../lib/repository';

export class FormConfig<TItem extends IItem> {

     /**
     * Edit form definition query
     */
    public editFormDefinition?: Observable<ResponseFormEdit<TItem>>;

    /**
     * Insert form definition query
     */
    public insertFormDefinition?: Observable<ResponseFormInsert>;

    /**
     * Key of submit text button
     */
    public submitTextKey = 'form.shared.save';

    /**
     * Key of delete text button
    */
    public deleteTextKey = 'form.shared.delete';

    /**
     * List of fields (questions) assigned to the form
     * This field should be populated automatically from the form definiton, do NOT set this field manually
     */
    public fields: FormField[] = [];

    /**
     * Function to be executed on insert of new item in the form
     */
    public insertFunction?: (item: any) => Observable<ResponseCreate<TItem>>;

    /**
     * Function to be executed on edit/update action og existing item in the form
     */
    public editFunction?: (item: any) => Observable<ResponseEdit<TItem>>;

    /**
     * Function to be executed when deleting an existing item in the form
     */
    public deleteFunction?: (item: any) => Observable<ResponseDelete>;

    /**
     * Indicates if snackbar is shown after save
     */
    public showSnackBar = true;

    /**
     * Key of the text shown in snackbar after inserting/saving item
     */
    public snackBarTextKey = 'form.shared.saved';

    /**
     * Key of the text shown in snackbar after successfully deleting an item
     */
    public deleteSnackBarTextKey = 'form.shared.deleted';

    /**
     * Type of the item in the form. This equals to the 'Codename' of the type.
     * For example, workouts are defined as 'Workout' type.
     */
    public type: string;

    /**
     * Item loaded in the form
     */
    public item?: any;

    /**
     * List of fields that are hidden and should not be shown in the form
     */
    public hiddenFields: string[] = [];

    /**
     * Indicates if field in form are cleared when the form is saved
     */
    public clearFormAfterSave = true;

    /**
     * Indicates if form contains delete button and if user can trigger 'delete method' defined in this form config
     * This property has to be enabled if the delete method is to be triggered
     */
    public enableDelete = true;

    /**
     * Callback before initializing the form
     */
    public onBeforeFormInit?: () => void;

    /**
     * Callback for when the form has fetched data from server and loaded form definitions
     */
    public onEditFormLoaded?: (form: ResponseFormEdit<TItem>) => void;

    /**
     * Callback for when the form has fetched data from server and loaded form definitions
     */
    public onInsertFormLoaded?: (form: ResponseFormInsert) => void;

    /**
     * Callback after a new item is successfully inserted
     */
    public onAfterInsert?: (response: ResponseCreate<TItem>) => void;

    /**
     * Callback after an existing item was saved
     */
    public onAfterUpdate?: (response: ResponseEdit<TItem>) => void;

    /**
     * Callback for handling errors
     */
    public onError?: (response: ErrorResponse | FormErrorResponse | any) => void;

    /**
     * Callback before both updating or inserting an item in the form
     */
    public onBeforeSave?: () => void;

    /**
     * Callback after an item was inserted on updated/edited
     */
    public OnAfterSave?: () => void;

    /**
     * Callback after deleting an item
     */
    public onAfterDelete?: (response: ResponseDelete) => void;

    /**
     * Callback before deleting an item
     */
    public onBeforeDelete?: (item: any) => void;

     /**
     * Called when a value in a field changes
     */
    public onFieldValueChange?: (config: FormConfig<TItem>, changedField: FormField, newValue: any) => void;

    /**
     * Loader configuration
     * @param start Loader start function
     * @param stop Loader stop function
     */
    public loaderConfig: { start: () => void, stop: () => void };

    /**
     * Resolver used to change the value of certain fields manually
     */
    public fieldValueResolver?: (fieldName: string, value: any) => string | boolean | number;

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;

    /**
     * Can be used to get custom field labels
     */
    public fieldLabelResolver?: (field: FormField, originalLabel: string) => Observable<string>;

     /**
     * Can be used to get custom option labels (e.g. in dropdown lists)
     */
    public optionLabelResolver?: (field: FormField, optionLabel: string) => Observable<string>;

    constructor(
    ) {
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
}
