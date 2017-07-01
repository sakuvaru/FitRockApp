import { FormConfig } from './form-config.class';
import { Observable } from 'rxjs/RX';
import { BaseField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse } from '../../lib/repository';

class BaseDynamicFormBuilder<TItem extends IItem>{

    protected config: FormConfig<TItem> = new FormConfig<TItem>();

    type(type: string): this {
        this.config.type = type;
        return this;
    }

    submitTextKey(text: string): this {
        this.config.submitTextKey = text;
        return this;
    }

    fields(fields: BaseField<any>[]): this {
        this.config.fields = fields;
        return this;
    }

    showFields(fields: string[]): this {
        this.config.showFields = fields;
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
        return this.config;
    }
}

export class DynamicFormInsertBuilder<TItem extends IItem> extends BaseDynamicFormBuilder<TItem>{
    insertFunction(insertFunction: (item: TItem) => Observable<ResponseCreate<TItem>>): this {
        this.config.insertFunction = insertFunction;
        return this;
    }

    onInsert(callback: (response: ResponseCreate<TItem>) => void): this {
        this.config.onInsert = callback;
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

    editFunction(editFunction: (item: TItem) => Observable<ResponseEdit<TItem>>): this {
        this.config.editFunction = editFunction;
        return this;
    }

    onUpdate(callback: (response: ResponseEdit<TItem>) => void): this {
        this.config.onUpdate = callback;
        return this;
    }

    build(): FormConfig<TItem> {
        return this.config;
    }
}