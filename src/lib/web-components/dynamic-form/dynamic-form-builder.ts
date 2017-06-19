import { FormConfig } from './form-config.class';
import { Observable } from 'rxjs/RX';
import { BaseField, IItem, ResponseCreate, ResponseEdit, FormErrorResponse, ErrorResponse } from '../../repository';

export class DynamicFormInsertBuilder<TItem extends IItem>{

    private config: FormConfig<TItem> = new FormConfig<TItem>();

    submitTextKey(text: string): this {
        this.config.submitTextKey = text;
        return this;
    }

    fields(fields: BaseField<any>[]): this {
        this.config.fields = fields;
        return this;
    }

    insertFunction(insertFunction: (item: TItem) => Observable<ResponseCreate<TItem>>): this {
        this.config.insertFunction = insertFunction;
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

    build(): FormConfig<TItem> {
        return this.config;
    }
}

export class DynamicFormEditBuilder<TItem extends IItem>{

    private config: FormConfig<TItem> = new FormConfig<TItem>();

    submitTextKey(text: string): this {
        this.config.submitTextKey = text;
        return this;
    }

    fields(fields: BaseField<any>[]): this {
        this.config.fields = fields;
        return this;
    }

    editFunction(editFunction: (item: TItem) => Observable<ResponseEdit<TItem>>): this {
        this.config.editFunction = editFunction;
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

    callback(callback: (response: ResponseEdit<TItem>) => void): this {
        this.config.updateCallback = callback;
        return this;
    }

    errorCallback(callback: (response: ErrorResponse | FormErrorResponse | any) => void): this {
        this.config.errorCallback = callback;
        return this;
    }

    build(): FormConfig<TItem> {
        return this.config;
    }
}