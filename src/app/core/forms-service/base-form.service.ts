import { Observable } from 'rxjs/Observable';

import { IService } from '../../core/type-service/iservice.class';

import { IFormsService } from './iforms-service.interface';
import { BaseField, FormConfig, HiddenField } from '../../../lib/web-components';
import { IItem, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../../lib/repository';

//Note - nested generics are not currently supported by Typescript 2 (13.5.2017) => take types in constructor
export abstract class BaseFormService<TItem extends IItem> implements IFormsService<TItem> {

    private defaultPrimaryKeyField: string = 'id';

    constructor(
        protected service: IService<TItem>,
        protected config?: {
            excludedEditFields?: string[],
            excludedInsertFields?: string[]
        }
    ) {
        if (!config){
            this.config = {};
        }
    }

    abstract getBaseFormFields(options?: { excludeFields?: string[] }): Observable<BaseField<any>[]>

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
        config: {
            itemId?: number,
            item?: TItem
        },
        options?: {
            saveFunction?: (item: TItem) => Observable<ResponseEdit<TItem>>,
            showSnackBar?: boolean,
            snackBarTextKey?: string,
            insertCallback?: (response: ResponseCreate<TItem>) => void,
            updateCallback?: (response: ResponseEdit<TItem>) => void,
            submitTextKey?: string,
            errorCallback?: (err: string) => void
        }): FormConfig<TItem> {

        if (!config.item && !config.itemId) {
            throw `Cannot render form because neither 'itemId' or 'item' config was provided`;
        }

        var fieldsLoader;
        if (config.itemId) {
            fieldsLoader = this.getEditFieldsFromId(config.itemId, this.config.excludedEditFields);
        }
        else {
            fieldsLoader = this.getEditFieldsFromItem(config.item, this.config.excludedEditFields);
        }

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
            fieldsLoader: () => fieldsLoader,
            errorCallback: options.errorCallback,
            editFunction: (item) => {
                if (options && options.saveFunction) {
                    return options.saveFunction(item);
                }
                return this.service.edit(item);
            }
        })
    }

    protected excludeFields(fields: Observable<BaseField<any>[]>, excludeFields: string[]): Observable<BaseField<any>[]> {

        return fields.map(fields => {

            var processedFields: BaseField<any>[] = [];

            fields.forEach(field => {
                var excludeField: boolean = false;

                if (excludeFields) {
                    if (excludeFields.find(fieldName => fieldName === field.key)) {
                        excludeField = true;
                    }
                }

                if (!excludeField) {
                    processedFields.push(field);
                }
            });
            return processedFields;
        });
    }

    protected getInsertFields(): Observable<BaseField<any>[]> {
        var fields = this.getBaseFormFields();

        return this.excludeFields(fields, this.config.excludedInsertFields);
    }

    protected getEditFieldsFromId(itemId: number, excludedFields: string[]): Observable<BaseField<any>[]> {
        var item: TItem;

        var fields = this.service.getById(itemId)
            .do(response => item = response.item)
            .flatMap(response => this.getBaseFormFields(excludedFields))
            .map(fields => {
                fields.forEach(field => {
                    // map values for form fields
                    field.value = item[field.key];
                });

                // append primary key column
                fields.push(this.getPrimaryKeyField(itemId));

                return fields;
            });

        return this.excludeFields(fields, this.config.excludedEditFields);
    }

    protected getEditFieldsFromItem(item: TItem, excludedFields: string[]): Observable<BaseField<any>[]> {
        var fields = this.getBaseFormFields(excludedFields)
            .map(fields => {
                fields.forEach(field => {
                    // map values for form fields
                    field.value = item[field.key];

                    // append primary key column
                    fields.push(this.getPrimaryKeyField(item.id));
                });
                return fields;
            });

        return this.excludeFields(fields, this.config.excludedEditFields);
    }

    protected getPrimaryKeyField(itemId: number, primaryKeyField?: string): HiddenField {
        if (!primaryKeyField) {
            primaryKeyField = this.defaultPrimaryKeyField;
        }

        return new HiddenField({
            key: primaryKeyField,
            required: true,
            value: itemId
        });
    }
}