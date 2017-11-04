import { FormConfig } from './form-config.class';
import { Observable } from 'rxjs/RX';
import { ResponseFormInsert, ResponseFormEdit, FormField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse, ResponseDelete } from '../../lib/repository';

class BaseDynamicFormBuilder<TItem extends IItem> {

    protected config: FormConfig<TItem> = new FormConfig<TItem>();

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
    onBeforeFormInit(callback: () => void): this {
        this.config.onBeforeFormInit = callback;
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
    * Called when a value in a field changes.
    * Can also be used to dynamically change other fields in form
    */
    onFieldValueChange(callback: (config: FormConfig<TItem>, changedField: FormField, newValue: any) => void): this {
        this.config.onFieldValueChange = callback;
        return this;
    }

    /**
    * Resolver used to change the value of certain fields manually
    */
    fieldValueResolver(resolver: (fieldName: string, value: any) => string | boolean | number): this {
        this.config.fieldValueResolver = resolver;
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
     * Indicates if local loader is enabled
     * @param enable Enabled or disabled
     */
    enableLocalLoader(enable: boolean): this {
        this.config.enableLocalLoader = enable;
        return this;
    }


    /**
     * Can be used to get custom field labels
     */
    fieldLabelResolver(resolver: (field: FormField, originalLabel: string) => Observable<string>): this {
        this.config.fieldLabelResolver = resolver;
        return this;
    }

    /**
     * Can be used to get custom option labels (e.g. in dropdown lists)
     */
    optionLabelResolver(resolver: (field: FormField, optionLabel: string) => Observable<string>): this {
        this.config.optionLabelResolver = resolver;
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

export class DynamicFormInsertBuilder<TItem extends IItem> extends BaseDynamicFormBuilder<TItem> {

    constructor(
        /**
         * Type of the item (codename)
         */
        protected type: string,
        /**
        * Function/Query used to fetch insert form definition from server
        */
        protected insertFormDefinition: Observable<ResponseFormInsert>,
        /**
         * Function used to insert a new object
         */
        protected insertFunction: (formData: Object) => Observable<ResponseCreate<TItem>>
    ) {
        super();

        this.config.type = type;
        this.config.insertFormDefinition = insertFormDefinition;
        this.config.insertFunction = insertFunction;
    }

    /**
     * Callback after a new item is successfully inserted
     */
    onAfterInsert(callback: (response: ResponseCreate<TItem>) => void): this {
        this.config.onAfterInsert = callback;
        return this;
    }

    /**
     * Function to call when form is loaded
     * @param callback Callback
     */
    onFormLoaded(callback: (form: ResponseFormInsert) => void): this {
        this.config.onInsertFormLoaded = callback;
        return this;
    }
}

export class DynamicFormEditBuilder<TItem extends IItem> extends BaseDynamicFormBuilder<TItem> {

    constructor(
        /**
         * Type of the item (codename)
         */
        protected type: string,
        /**
        * Function/Query used to fetch edit form definition from server
        */
        protected editFormDefinition: Observable<ResponseFormEdit<TItem>>,
        /**
         * Function used to edit given object
         */
        protected editFunction: (formData: Object) => Observable<ResponseEdit<TItem>>
    ) {
        super();

        this.config.type = type;
        this.config.editFunction = editFunction;
        this.config.editFormDefinition = editFormDefinition;
    }

    /**
     * Function to call when form is loaded
     * @param callback Callback
     */
    onFormLoaded(callback: (form: ResponseFormEdit<TItem>) => void): this {
        this.config.onEditFormLoaded = callback;
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
    deleteFunction(callback: (formData: Object) => Observable<ResponseDelete>): this {
        this.config.deleteFunction = callback;
        return this;
    }

    /**
    * Callback before deleting an item
    */
    onBeforeDelete(callback: (formData: Object) => void): this {
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
