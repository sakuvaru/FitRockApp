import { TypeResolver } from '../models/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';
import { IItem } from '../interfaces/iitem.interface';
import { FormField, FormFieldOptions, DropdownFieldOption } from '../models/form-fields';
import { IFormField, IDropdownFieldOption } from '../interfaces/iform-fields';
import { IPropertyInfo } from '../interfaces/iproperty-info.interface';
import { PropertyInfo } from '../models/property-info.class';

export class MapService {

    private readonly itemPropertiesPropertyName: string = 'itemProperties';

    constructor(
        private typeResolverService: TypeResolverService
    ) {
    }

    private isEntityField(fieldValue: any): boolean {
        if (fieldValue instanceof Object) {
            // if field contains property 'type' it is considered as 'Entity' field
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

        // map item property infos
        var itemProperties = this.mapListOfItemProperties(item.itemProperties);

        // assign item properties
        itemTyped.itemProperties = itemProperties;

        properties.forEach(fieldName => {
            if (fieldName === this.itemPropertiesPropertyName){
                // do not process item properties property
                return;
            }

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
                // map single object
                itemTyped[propertyName] = this.mapFields(fieldValue);
            }
            else {
                if (Array.isArray(fieldValue)) {
                    // map list of nested entity types
                    var listItems: any[] = [];
                    fieldValue.forEach(listItem => {
                        if (this.isEntityField(listItem)) {
                            listItems.push(this.mapFields(listItem));
                        }
                        else{
                            // unknown field type
                            listItems.push(listItem);
                        }
                    })
                    itemTyped[propertyName] = listItems;
                }
                else {
                    itemTyped[propertyName] = fieldValue;
                }
            }
        });

        return itemTyped;
    }

    mapItem<TItem extends IItem>(item: IItem): TItem {
        return this.mapFields(item);
    }

    mapItems<TItem extends IItem>(items: IItem[]): TItem[] {
        if (!items) {
            throw Error(`Cannot map items`);
        }

        var typedItems: TItem[] = [];

        items.forEach(item => {
            typedItems.push(this.mapItem<TItem>(item));
        });

        return typedItems;
    }

    mapFormFields(formFields: IFormField[]): FormField[] {
        if (!formFields) {
            throw Error(`Cannot map form fields`);
        }

        var fields: FormField[] = [];

        formFields.forEach(field => {
            fields.push(this.mapFormField(field));
        });

        return fields;
    }

    mapFormField(formField: IFormField): FormField {
        return new FormField({
            key: formField.key,
            controlType: formField.controlType,
            defaultValue: formField.defaultValue,
            required: formField.required,
            rawValue: formField.value,
            options: formField.options ? new FormFieldOptions({
                falseOptionLabel: formField.options.falseOptionLabel,
                trueOptionLabel: formField.options.trueOptionLabel,
                listOptions: this.mapListOptions(formField.options.listOptions),
                maxAutosizeRows: formField.options.maxAutosizeRows,
                maxLength: formField.options.maxLength,
                minAutosizeRows: formField.options.minAutosizeRows,
                minLength: formField.options.minLength,
                width: formField.options.width,
                maxNumberValue: formField.options.maxNumberValue,
                minNumberValue: formField.options.minNumberValue
            }) : undefined
        });
    }

    private mapListOptions(listOptions: IDropdownFieldOption[] | undefined): DropdownFieldOption[]{
        if (!listOptions) {
            return [];
        }

        var mappedOptions: DropdownFieldOption[] = [];

        if (!Array.isArray(listOptions)) {
            throw Error(`Cannot map list options because the object is not an array!`);
        }
        listOptions.forEach(option => {
            mappedOptions.push(new DropdownFieldOption(option.value, option.name, option.extraDataJson));
        });

        return mappedOptions;
    }

    private mapListOfItemProperties(properties: IPropertyInfo[]): PropertyInfo[]{
         if (!properties) {
            return [];
        }

        var mappedProperties: PropertyInfo[] = [];

        if (!Array.isArray(properties)) {
            throw Error(`Cannot map property infos because the object is not an array!`);
        }
        properties.forEach(property => {
            mappedProperties.push(new PropertyInfo(property.name, property.propertyType));
        });

        return mappedProperties;
    }
}