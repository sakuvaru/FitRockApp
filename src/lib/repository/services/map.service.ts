import { TypeResolver } from '../models/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';
import { IItem } from '../interfaces/iitem.interface';
import { BaseField, FormFieldOptions, DropdownFieldOption } from '../models/form-fields';
import { IFormField, IDropdownFieldOption } from '../interfaces/iform-fields';

export class MapService {
    constructor(
        private typeResolverService: TypeResolverService
    ) {
    }

    private isEntityField(fieldValue: any): boolean {
        if (fieldValue instanceof Object) {
            if (fieldValue["type"]) {
                return true;
            }
        }

        return false;
    }

    private mapFields(item: IItem): any {
        var properties = Object.getOwnPropertyNames(item);

        // create typed item
        var itemTyped = this.typeResolverService.createTypedObj(item.type, item);

        properties.forEach(fieldName => {
            var propertyName;

            // resolve value into a different 'property'
            if (itemTyped.resolver) {
                propertyName = itemTyped.resolver(fieldName);
            }

            // if property name is null/empty, use elements codename
            if (!propertyName) {
                propertyName = fieldName;
            }

            var fieldValue = item[fieldName];

            if (this.isEntityField(fieldValue)) {
                // field value is a nested entity type - recursively get object & properties
                itemTyped[propertyName] = this.mapFields(fieldValue);
            }
            else {
                itemTyped[propertyName] = fieldValue;
            }
        });

        return itemTyped;
    }

    mapItem<TItem extends IItem>(item: IItem): TItem {
        return this.mapFields(item);
    }

    mapItems<TItem extends IItem>(items: IItem[]): TItem[] {
        if (!items) {
            return null;
        }

        var typedItems: TItem[] = [];

        items.forEach(item => {
            typedItems.push(this.mapItem<TItem>(item));
        });

        return typedItems;
    }

    mapFormFields(formFields: IFormField<any>[]): BaseField<any>[] {
        if (!formFields) {
            return null;
        }

        var fields: BaseField<any>[] = [];

        formFields.forEach(field => {
            fields.push(this.mapFormField(field));
        });

        return fields;
    }

    mapFormField(formField: IFormField<any>): BaseField<any> {
        return new BaseField<any>({
            key: formField.key,
            controlType: formField.controlType,
            defaultValue: formField.defaultValue,
            required: formField.required,
            value: formField.value,
            options: new FormFieldOptions({
                falseOptionLabel: formField.options.falseOptionLabel,
                trueOptionLabel: formField.options.trueOptionLabel,
                listOptions: this.mapListOptions(formField.options.listOptions),
                maxAutosizeRows: formField.options.maxAutosizeRows,
                maxLength: formField.options.maxLength,
                minAutosizeRows: formField.options.minAutosizeRows,
                minLength: formField.options.minLength,
                width: formField.options.width
            })
        });
    }

    private mapListOptions(listOptions: IDropdownFieldOption[]): DropdownFieldOption[]{
        if (!listOptions){
            return [];
        }

        var mappedOptions: DropdownFieldOption[] = [];

        if (!Array.isArray){
            throw Error(`Cannot map list options because the object is not an array!`);
        }
        listOptions.forEach(option => {
            mappedOptions.push(new DropdownFieldOption(option.value, option.name));
        });

        return mappedOptions;
    }
}