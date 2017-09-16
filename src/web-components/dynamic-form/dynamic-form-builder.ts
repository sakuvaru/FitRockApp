import { FormConfig } from './form-config.class';
import { Observable } from 'rxjs/RX';
import { FormField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse, ResponseDelete } from '../../lib/repository';

class BaseDynamicFormBuilder<TItem extends IItem>{

    protected config: FormConfig<TItem> = new FormConfig<TItem>();

    /**
     * Type of the item in the form. This equals to the 'Codename' of the type. 
     * For example, workouts are defined as 'Workout' type.
     */
    type(type: string): this {
        this.config.type = type;
        return this;
    }

    /** 
    * Key of delete text button
    */
    deleteTextKey(key: string): this {
        this.config.deleteTextKey = key;
        return this;
    }

    /**
    * Key of submit text button
    */
    submitTextKey(key: string): this {
        this.config.submitTextKey = key;
        return this;
    }

    /**
     * Adds field to form
     * @param fields Field to be added to form
     */
    fields(fields: FormField[]): this {
        this.config.fields = fields;
        return this;
    }

    /**
     * Fields that are hidden from form
     * @param fields Hidden fields
     */
    hiddenFields(fields: string[]): this {
        if (fields) {
            this.config.hiddenFields = fields;
        }
        return this;
    }

    /**
     * /**
     * Indicates if field in form are cleared when the form is saved
     * @param clear 
     */
    clearFormAfterSave(clear: boolean): this {
        this.config.clearFormAfterSave = clear;
        return this;
    }

    /**
     * Indicates if form contains delete button and if user can trigger 'delete method' defined in this form config
     * This property has to be enabled if the delete method is to be triggered
     */
    enableDelete(enableDelete: boolean): this {
        this.config.enableDelete = enableDelete;
        return this;
    }

    /**
     * Indicates if snackbar is shown after save
     */
    showSnackBar(show: boolean): this {
        this.config.showSnackBar = show;
        return this;
    }

    /**
  * Key of the text shown in snackbar after inserting/saving item
  */
    snackBarTextKey(text: string): this {
        this.config.snackBarTextKey = text;
        return this;
    }

    /**
    * Callback for handling errors
    */
    onError(callback: (response: ErrorResponse | FormErrorResponse | any) => void): this {
        this.config.onError = callback;
        return this;
    }

    /**
    * Callback when initializing the form
    */
    onFormInit(callback: () => void): this {
        this.config.onFormInit = callback;
        return this;
    }

    /**
     * Callback for when the form has 'config' available. This is useful when the fields are loaded from server
     * rather then defined manually. It is called after 'onFormInit'.
     */
    onFormLoaded(callback: () => void): this {
        this.config.onFormLoaded = callback;
        return this;
    }

    /**
    * Callback before both updating or inserting an item in the form
    */
    onBeforeSave(callback: () => void): this {
        this.config.onBeforeSave = callback;
        return this;
    }

    /**
     * Callback after an item was inserted on updated/edited
     */
    onAfterSave(callback: () => void): this {
        this.config.OnAfterSave = callback;
        return this;
    }

    /**
    * Called when a value in a field changes
    */
    onFieldValueChange(callback: (config: FormConfig<TItem>, changedField: FormField, newValue: any) => void): this {
        this.config.onFieldValueChange = callback;
        return this;
    }

    /**
     * Use to manually set value of certain field in form.
     * Call after all fields were initiliazed
     * @param fieldName Name of field
     * @param value Value
     */
    withFieldValue(fieldName: string, value: string | boolean | number): this {
        // find field
        var field = this.config.fields.find(m => m.key.toLowerCase() === fieldName.toLowerCase());

        if (!field) {
            throw Error(`Cannot set value for field '${fieldName}' because it does not exist in form`);
        }

        // boolean field needs to return 'string' with 'false' value otherwise the JSON .NET mapping
        // does not map the object 
        if (!value) {
            if (typeof (value) === 'boolean') {
                field.value = 'false';
            }
            field.value = '';
        }

        field.value = value.toString().trim();;
        return this;
    }

    /**
 * Loader configuration
 * @param start Start loader function
 * @param stop  Stop loader function
 */
    loaderConfig(start: () => void, stop: () => void): this {
        this.config.loaderConfig = { start: start, stop: stop };
        return this;
    }

    /**
     * Build form config from the form builder query
     */
    build(): FormConfig<TItem> {
        // default values for insert form
        this.config.clearFormAfterSave = true;

        return this.config;
    }
}

export class DynamicFormInsertBuilder<TItem extends IItem> extends BaseDynamicFormBuilder<TItem>{

    /**
    * Function to be executed on insert of new item in the form
    */
    insertFunction(callback: (item: any) => Observable<ResponseCreate<TItem>>): this {
        this.config.insertFunction = callback;
        return this;
    }

    /**
     * Callback after a new item is successfully inserted
     */
    onAfterInsert(callback: (response: ResponseCreate<TItem>) => void): this {
        this.config.onAfterInsert = callback;
        return this;
    }
}

export class DynamicFormEditBuilder<TItem extends IItem> extends BaseDynamicFormBuilder<TItem>{

    /**
    * Item loaded in the form
    */
    getItem(): TItem {
        return this.config.item;
    }

    /**
    * Item loaded in the form
    */
    setItem(item: TItem): this {
        this.config.item = item;
        return this;
    }

    /**
    * Function to be executed on edit/update action og existing item in the form
    */
    editFunction(callback: (item: any) => Observable<ResponseEdit<TItem>>): this {
        this.config.editFunction = callback;
        return this;
    }

    /**
    * Callback after an existing item was saved
    */
    onAfterUpdate(callback: (response: ResponseEdit<TItem>) => void): this {
        this.config.onAfterUpdate = callback;
        return this;
    }

    /**
   * Function to be executed when deleting an existing item in the form
   */
    deleteFunction(callback: (item: any) => Observable<ResponseDelete>): this {
        this.config.deleteFunction = callback;
        return this;
    }

    /**
    * Callback before deleting an item
    */
    onBeforeDelete(callback: (item: any) => void): this {
        this.config.onBeforeDelete = callback;
        return this;
    }

    /**
    * Callback after deleting an item
    */
    onAfterDelete(callback: (response: ResponseDelete) => void): this {
        this.config.onAfterDelete = callback;
        return this;
    }

    /**
     * Build form config out of builder query
     */
    build(): FormConfig<TItem> {
        return this.config;
    }
}