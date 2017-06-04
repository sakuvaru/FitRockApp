import { Observable } from 'rxjs/Observable';

import { IService } from '../../core/type-service/iservice.class';

import { IFormsService } from './iforms-service.interface';
import { BaseField, FormConfig } from '../../../lib/web-components';
import { IItem, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../../lib/repository';

//Note - nested generics are not currently supported by Typescript 2 (13.5.2017) => take types in constructor
export abstract class BaseFormService<TItem extends IItem> implements IFormsService<TItem> {

    constructor(
        protected service: IService<TItem>,
    ) {
    }

    abstract getInsertFields(): Observable<BaseField<any>[]>;

    abstract getEditFields(itemId: number): Observable<BaseField<any>[]>;

    getInsertForm(
        options?: {
            saveFunction?: (item: TItem) => Observable<ResponseCreate<TItem>>,
            showSnackBar?: boolean,
            snackBarText?: string,
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            submitText?: string,
            errorCallback?: (err: string) => void
        }): FormConfig<TItem> {

        var submitText: string;
        if (options.submitText) {
            submitText = options.submitText;
        }
        else {
            submitText = "Vytvořit";
        }

        return new FormConfig<TItem>({
            submitText: submitText,
            showSnackBar: options.showSnackBar,
            snackBarText: options.snackBarText,
            insertCallback: options.insertCallback,
            updateCallback: options.updateCallback,
            fieldsLoader: () => this.getInsertFields(),
            errorCallback: options.errorCallback,
            insertFunction: (item) => {
                if (options && options.saveFunction) {
                    return options.saveFunction(item);
                }
                return this.service.create(item);
            }
        })
    }

    getEditForm(
        itemId: number,
        options?: {
            saveFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>,
            showSnackBar?: boolean,
            snackBarText?: string,
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            submitText?: string,
            errorCallback?: (err: string) => void
        }): FormConfig<TItem> {

        var submitText: string;
        if (options.submitText) {
            submitText = options.submitText;
        }
        else {
            submitText = "Uložit";
        }

        return new FormConfig<TItem>({
            submitText: submitText,
            showSnackBar: options.showSnackBar,
            snackBarText: options.snackBarText,
            insertCallback: options.insertCallback,
            updateCallback: options.updateCallback,
            fieldsLoader: () => this.getEditFields(itemId),
            errorCallback: options.errorCallback,
            editFunction: (item) => {
                if (options && options.saveFunction) {
                    return options.saveFunction(item);
                }
                return this.service.edit(item);
            }
        })
    }
}