import { Observable } from 'rxjs/RX';
import { FormGroup } from '@angular/forms';
import {
    DataFormEditResponse, DataFormInsertResponse, DataFormField, DataFormEditDefinition,
    DataFormInsertDefinition, DataFormDeleteResponse, DataFormFieldChangeResult
} from './data-form-models';

export class DataFormConfig {


    /**
     * Indicates if form is wrapped in card
     */
    public wrapInCard: boolean = true;

    /**
    * Form definition query
    */
    public formDefinition: Observable<DataFormEditDefinition | DataFormInsertDefinition>;

    /**
     * List of fields (questions) assigned to the form
     * This field should be populated automatically from the form definiton, do NOT set this field manually
     */
    public fields: DataFormField[] = [];

    /**
     * Indiates if current form is an edit form
     */
    public isEditForm: boolean = false;

    /**
     * Indiates if current form is an insert form
     */
    public isInsertForm: boolean = false;

    /**
     * Save function for handling create/edit actions
     */
    public saveFunction: (formData: Object) => Observable<DataFormInsertResponse | DataFormEditResponse>;

    /**
     * Function to be executed when deleting an existing item in the form
     */
    public deleteFunction?: (formData: Object) => Observable<DataFormDeleteResponse>;

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
     * Callback for when the form has fetched data
     */
    public onFormLoaded?: (form: DataFormEditDefinition | DataFormInsertDefinition) => void;

    /**
     * Callback for saving an item
     */
    public onAfterSave?: (response: DataFormInsertResponse | DataFormEditResponse) => void;

    /**
     * Callback for errors
     */
    public onError?: (error: any) => void;

    /**
     * Callback before both updating or inserting an item in the form
     */
    public onBeforeSave?: (formData: Object) => void;

    /**
     * Callback after deleting an item
     */
    public onAfterDelete?: (response: DataFormDeleteResponse) => void;

    /**
     * Callback before deleting an item
     */
    public onBeforeDelete?: (formData: Object) => void;

    /**
    * Called when a value in a field changes
    */
    public onFieldValueChange?: (fields: DataFormField[], changedField: DataFormField, newValue: string | boolean | number) => Observable<DataFormFieldChangeResult | void>;

    /**
     * Resolver used to change the value of certain fields manually
     */
    public fieldValueResolver?: (fieldName: string, value: any) => Observable<string | boolean | number>;

    /**
     * Indicates if local loader is enabled
     */
    public enableLocalLoader = true;

    /**
     * Can be used to get custom field labels
     */
    public fieldLabelResolver?: (field: DataFormField, originalLabel: string) => Observable<string>;

    /**
    * Can be used to get custom option labels (e.g. in dropdown lists)
    */
    public optionLabelResolver?: (field: DataFormField, optionLabel: string) => Observable<string>;

    constructor(
        /**
        * Type of the form
        * This value is used e.g. for translations and identification of type
        */
        public type: string
    ) {
    }

}
