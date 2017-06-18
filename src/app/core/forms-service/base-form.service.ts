import { Observable } from 'rxjs/Observable';
import { IService } from '../../core/type-service/iservice.class';
import { IFormsService } from './iforms-service.interface';
import { BaseField, FormConfig, HiddenField, DynamicFormService, DynamicFormEditBuilder, DynamicFormInsertBuilder } from '../../../lib/web-components';
import { IItem, ResponseDelete, ResponseCreate, ResponseEdit, ResponseMultiple, ResponseSingle } from '../../../lib/repository';

//Note - nested generics are not currently supported by Typescript 2 (13.5.2017) => take types in constructor
export abstract class BaseFormService<TItem extends IItem> implements IFormsService<TItem> {

    private defaultPrimaryKeyField: string = 'id';

    constructor(
        protected service: IService<TItem>,
        protected dynamicFormService: DynamicFormService,
        protected config?: {
            excludedEditFields?: string[],
            excludedInsertFields?: string[]
        }
    ) {
        if (!config) {
            this.config = {};
        }
    }

    abstract getBaseFormFields(options?: { excludeFields?: string[] }): Observable<BaseField<any>[]>

    insertForm(): DynamicFormInsertBuilder<TItem> {
        var builder = new DynamicFormInsertBuilder<TItem>();

        // set default field loader
        builder.fieldsLoader(() => this.getInsertFields());

        // set default save function
        builder.insertFunction((item) => this.service.create(item).set())

        // set default button text
        builder.submitTextKey('form.shared.insert');

        return builder;
    }

    editFormById(itemId: number): DynamicFormEditBuilder<TItem> {
        var builder = new DynamicFormEditBuilder<TItem>();

        builder.fieldsLoader(() => this.getEditFieldsFromId(itemId, this.config.excludedEditFields));

        // set default save function
        builder.editFunction((item) => this.service.edit(item).set());

        // set default button text
        builder.submitTextKey('form.shared.save');

        return builder;
    }
    editFormByItem(item: TItem): DynamicFormEditBuilder<TItem> {
        var builder = new DynamicFormEditBuilder<TItem>();

        builder.fieldsLoader(() => this.getEditFieldsFromItem(item, this.config.excludedEditFields));

        // set default save function
        builder.editFunction((item) => this.service.edit(item).set());

        // set default button text
        builder.submitTextKey('form.shared.save');

        return builder;
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

        var fields = this.service.item().byId(itemId).get()
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
                });

                // append primary key column
                fields.push(this.getPrimaryKeyField(item.id));

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