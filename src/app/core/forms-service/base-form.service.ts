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
            snackBarTextKey?: string,
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            submitTextKey?: string,
            errorCallback?: (err: string) => void
        }): FormConfig<TItem> {

        if (!options) {
            options = {};
        }

        var submitTextKey: string;
        if (options.submitTextKey) {
            submitTextKey = options.submitTextKey;
        }
        else {
            submitTextKey = 'form.shared.insert';
        }

        return new FormConfig<TItem>({
            submitTextKey: submitTextKey,
            showSnackBar: options.showSnackBar,
            snackBarTextKey: options.snackBarTextKey,
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
            snackBarTextKey?: string,
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            submitTextKey?: string,
            errorCallback?: (err: string) => void
        }): FormConfig<TItem> {

        if (!options) {
            options = {};
        }

        var submitTextKey: string;
        if (options.submitTextKey) {
            submitTextKey = options.submitTextKey;
        }
        else {
            submitTextKey = 'form.shared.save';
        }

        return new FormConfig<TItem>({
            submitTextKey: submitTextKey,
            showSnackBar: options.showSnackBar,
            snackBarTextKey: options.snackBarTextKey,
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