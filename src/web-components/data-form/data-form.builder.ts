import { Observable } from 'rxjs/Rx';

import {
    IItem,
    ResponseCreate,
    ResponseDelete,
    ResponseEdit,
    ResponseFormEdit,
    ResponseFormInsert,
} from '../../lib/repository';
import {
    DataFormDeleteResponse,
    DataFormEditDefinition,
    DataFormEditResponse,
    DataFormField,
    DataFormFieldChangeResult,
    DataFormInsertDefinition,
    DataFormInsertResponse,
    DataFormSection,
    DataFormMultipleChoiceFieldConfig
} from './data-form-models';
import { DataFormConfig } from './data-form.config';
import { dataFormBuilderUtils } from './data-form-builder-utils';

export class DataFormBuilder<TItem extends IItem> {

    private readonly dialogClass: string = 'w-dialog-panel';

    private config: DataFormConfig;

    constructor(
        type: string,
        isEditForm: boolean,
        isInsertForm: boolean,
        formDefinition: Observable<ResponseFormEdit<TItem> | ResponseFormInsert>,
        saveFunction: (formData: Object) => Observable<ResponseCreate<TItem> | ResponseEdit<TItem>>,
        options?: {
            deleteFunction?: (formData: Object) => Observable<ResponseDelete>
        }
    ) {
        this.config = new DataFormConfig(type);

        // assign dialog calss
        this.dialogPanelClass(this.dialogClass);

        // set form status
        this.config.isEditForm = isEditForm;
        this.config.isInsertForm = isInsertForm;

        // assign form definition
        this.config.formDefinition = dataFormBuilderUtils.mapFormDefinition(type, formDefinition);

        // assign save function
        this.config.saveFunction = dataFormBuilderUtils.mapSaveFunction(type, saveFunction);

        // assign delete function if provided
        if (options && options.deleteFunction) {
            this.config.deleteFunction = dataFormBuilderUtils.mapDeleteFunction(type, options.deleteFunction);
        }
    }

    /**
    * Called when a value in a field changes.
    * Can be used to modify the field or value.
    * 
    */
    onFieldValueChange(callback: (fields: DataFormField[], changedField: DataFormField, newValue: string | Date | number | boolean | object | undefined) => Observable<DataFormFieldChangeResult | void>): this {
        this.config.onFieldValueChange = callback;
        return this;
    }

    /**
    * Can be used to configure field and its properties upon initial load
    * You can set value, label or any other property...
    */
    configField(resolver: (field: DataFormField, item: TItem | undefined) => Observable<DataFormField>): this {
        this.config.configField = resolver;
        return this;
    }

    /**
     * List of field keys that will be ignored by the form
     */
    ignoreFields(fieldKeys: string[]): this {
        this.config.ignoreFields = fieldKeys;
        return this;
    }

    /**
     * Indicates if action buttons (save, edit, delete) are rendered
     */
    renderButtons(render: boolean): this {
        this.config.renderButtons = render;
        return this;
    }

    /**
     * Indicates if form is within a card
     * @param wrap Wrap in card
     */
    wrapInCard(wrap: boolean): this {
        this.config.wrapInCard = wrap;
        return this;
    }

    /**
     * If enabled, form can be send only by hitting enter. Small devices will have button displayed
     */
    hideButtonsOnLargeScreen(hide: boolean): this{
        this.config.hideButtonsOnLargeScreen = hide;
        return this;
    }

    /**
     * Section
     * @param section Section
     */
    section(section: DataFormSection): this {
        if (section instanceof DataFormSection) {
            this.config.sections.push(section);
        }

        this.config.sections.push(new DataFormSection(section.title, section.size, section.rowNumber));

        return this;
    }

    /**
     * Sections of the form
     * @param sections Sections
     */
    sections(sections: DataFormSection[]): this {
        sections.forEach(section => {
            if (section instanceof DataFormSection) {
                this.config.sections.push(section);
            }

            this.config.sections.push(new DataFormSection(section.title, section.size, section.rowNumber));
        });

        return this;
    }

    /**
     * Indicates if form contains delete button and if user can trigger 'delete method' defined in this form config
     * This property has to be enabled if the delete method is to be triggered
     */
    enableDelete(enable: boolean): this {
        this.config.enableDelete = enable;
        return this;
    }

    /**
     * Indicates if field in form are cleared when the form is saved
     */
    clearFormAfterSave(clear: boolean): this {
        this.config.clearFormAfterSave = clear;
        return this;
    }

    /**
    * Callback for when the form has fetched data
    */
    onInsertFormLoaded(resolver: (form: DataFormInsertDefinition) => void): this {
        this.config.onInsertFormLoaded = resolver;
        return this;
    }

    /**
    * Callback for when the form has fetched data
    */
    onEditFormLoaded(resolver: (form: DataFormEditDefinition<TItem>) => void): this {
        this.config.onEditFormLoaded = resolver;
        return this;
    }

    /**
     * Callback for saving a new item
     */
    onAfterInsert(resolver: (response: DataFormInsertResponse<TItem>) => void): this {
        this.config.onAfterInsert = resolver;
        return this;
    }

    /**
    * Callback for saving an item
    */
    onAfterEdit(resolver: (response: DataFormEditResponse<TItem>) => void): this {
        this.config.onAfterEdit = resolver;
        return this;
    }

    /**
     * Callback for errors
     */
    onError(resolver: (error: any) => void): this {
        this.config.onError = resolver;
        return this;
    }

    /**
     * Callback before both updating or inserting an item in the form
     */
    onBeforeSave(resolver: (formData: Object) => void): this {
        this.config.onBeforeDelete = resolver;
        return this;
    }

    /**
     * Callback after deleting an item
     */
    onAfterDelete(resolver: (response: DataFormDeleteResponse) => void): this {
        this.config.onAfterDelete = resolver;
        return this;
    }

    /**
     * Callback before deleting an item
     */
    onBeforeDelete(resolver: (formData: Object) => void): this {
        this.config.onBeforeDelete = resolver;
        return this;
    }

    /**
    * Indicates if local loader is enabled
    */
    enableLocalLoader(enable: boolean): this {
        this.config.enableLocalLoader = enable;
        return this;
    }

    /**
     * Can be used to get custom field labels
     */
    fieldLabelResolver(resolver: (field: DataFormField, originalLabel: string) => Observable<string>): this {
        this.config.fieldLabelResolver = resolver;
        return this;
    }

    /**
    * Can be used to get custom option labels (e.g. in dropdown lists)
    */
    optionLabelResolver(resolver: (field: DataFormField, optionLabel: string) => Observable<string>): this {
        this.config.optionLabelResolver = resolver;
        return this;
    }

    /**
    * Custom text shown on button. If none is set, default texts will be used
    */
    customButtonSaveText(text: Observable<string>): this {
        this.config.customButtonSaveText = text;
        return this;
    }

    /**
     * Class used for dialogs within form
     */
    dialogPanelClass(className: string): this {
        this.config.dialogPanelClass = className;
        return this;
    }

    /**
     * Required configuration for multiple choice fields
     */
    multipleChoiceResolver<TConfigModel>(resolver: (field: DataFormField, item: TItem) => DataFormMultipleChoiceFieldConfig<TConfigModel> | undefined): this {
        this.config.multipleChoiceResolver = resolver;
        return this;
    }

    build(): DataFormConfig {
        return this.config;
    }
}

