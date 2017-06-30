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

    callback(callback: (response: ResponseCreate<TItem>) => void): this {
        this.config.insertCallback = callback;
        return this;
    }

    errorCallback(callback: (response: ErrorResponse | FormErrorResponse | any) => void): this {
        this.config.errorCallback = callback;
        return this;
    }

    onFormInit(callback: () => void): this{
        this.config.onFormInit = callback;
        return this;
    }

     onFormLoaded(callback: () => void): this{
        this.config.onFormLoaded = callback;
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

    build(): FormConfig<TItem> {
        return this.config;
    }
}