import { FormConfig } from './form-config.class';
import { Observable } from 'rxjs/RX';
import { BaseField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse, ResponseDelete } from '../../lib/repository';

class BaseDynamicFormBuilder<TItem extends IItem>{

    protected config: FormConfig<TItem> = new FormConfig<TItem>();

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

    fields(fields: BaseField<any>[]): this {
        this.config.fields = fields;
        return this;
    }

    hiddenFields(fields: string[]): this {
        if (fields) {
            this.config.hiddenFields = fields;
        }
        return this;
    }

    clearFormAfterSave(clear: boolean): this {
        this.config.clearFormAfterSave = clear;
        return this;
    }

    showSnackBar(show: boolean): this {
        this.config.showSnackBar = show;
        return this;
    }

    snackBarTextKey(text: string): this {
        this.config.snackBarTextKey = text;
        return this;
    }

    onError(callback: (response: ErrorResponse | FormErrorResponse | any) => void): this {
        this.config.onError = callback;
        return this;
    }

    onFormInit(callback: () => void): this {
        this.config.onFormInit = callback;
        return this;
    }

    onFormLoaded(callback: () => void): this {
        this.config.onFormLoaded = callback;
        return this;
    }

    onBeforeSave(callback: () => void): this {
        this.config.onBeforeSave = callback;
        return this;
    }

    onAfterSave(callback: () => void): this {
        this.config.OnAfterSave = callback;
        return this;
    }

    /**
    * Called when a value in a field changes
    */
    onFieldValueChange(callback: (config: FormConfig<TItem>, changedField: BaseField<any>, newValue: any) => void): this {
        this.config.onFieldValueChange = callback;
        return this;
    }

    /**
     * Use to manually set value of certain field in form.
     * Call after all fields were initiliazed
     * @param fieldName Name of field
     * @param value Value
     */
    withFieldValue(fieldName: string, value: any): this {
        // find field
        var field = this.config.fields.find(m => m.key.toLowerCase() === fieldName.toLowerCase());

        if (!field) {
            throw Error(`Cannot set value for field '${fieldName}' because it does not exist in form`);
        }

        field.value = value;
        return this;
    }


    build(): FormConfig<TItem> {
        // default values for insert form
        this.config.clearFormAfterSave = true;

        return this.config;
    }
}

export class DynamicFormInsertBuilder<TItem extends IItem> extends BaseDynamicFormBuilder<TItem>{
    insertFunction(callback: (item: any) => Observable<ResponseCreate<TItem>>): this {
        this.config.insertFunction = callback;
        return this;
    }

    onAfterInsert(callback: (response: ResponseCreate<TItem>) => void): this {
        this.config.onAfterInsert = callback;
        return this;
    }
}

export class DynamicFormEditBuilder<TItem extends IItem> extends BaseDynamicFormBuilder<TItem>{

    getItem(): TItem {
        return this.config.item;
    }
    setItem(item: TItem): this {
        this.config.item = item;
        return this;
    }

    editFunction(callback: (item: any) => Observable<ResponseEdit<TItem>>): this {
        this.config.editFunction = callback;
        return this;
    }

    onAfterUpdate(callback: (response: ResponseEdit<TItem>) => void): this {
        this.config.onAfterUpdate = callback;
        return this;
    }

    deleteFunction(callback: (item: any) => Observable<ResponseDelete>): this {
        this.config.deleteFunction = callback;
        return this;
    }

    onBeforeDelete(callback: (item: any) => void): this {
        this.config.onBeforeDelete = callback;
        return this;
    }

    onAfterDelete(callback: (response: ResponseDelete) => void): this {
        this.config.onAfterDelete = callback;
        return this;
    }

    build(): FormConfig<TItem> {
        // default values for edit form
        this.config.clearFormAfterSave = false;

        return this.config;
    }
}