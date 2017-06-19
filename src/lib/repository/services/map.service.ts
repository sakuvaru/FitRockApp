import { TypeResolver } from '../models/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';
import { IItem } from '../interfaces/iitem.interface';
import { BaseField } from '../models/base-field.class';
import { IFormField } from '../interfaces/iform-field';

export class MapService {
    constructor(
        private typeResolverService: TypeResolverService
    ) { 
    }

    private isEntityField(fieldValue: any): boolean{
        if (fieldValue instanceof Object){
            if (fieldValue["type"]){
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

            if (this.isEntityField(fieldValue)){
                // field value is a nested entity type - recursively get object & properties
                itemTyped[propertyName] = this.mapFields(fieldValue);
            }
            else{
                itemTyped[propertyName] = fieldValue;
            }
        });

        return itemTyped;
    }

    mapItem<TItem extends IItem>(item: IItem): TItem{
        return this.mapFields(item);
    }

    mapItems<TItem extends IItem>(items: IItem[]): TItem[]{
        if (!items){
            return null;
        }

        var typedItems: TItem[] = [];

        items.forEach(item => {
            typedItems.push(this.mapItem<TItem>(item));
        });

        return typedItems;
    }

    mapFormFields(formFields: IFormField<any>[]): BaseField<any>[]{
         if (!formFields){
            return null;
        }

         var fields: BaseField<any>[] = [];

        formFields.forEach(field => {
            fields.push(this.mapFormField(field));
        });

        return fields;
    }

    mapFormField(formField: IFormField<any>): BaseField<any>{
        return new BaseField<any>({
            key: formField.key,
            controlType: formField.controlType,
            defaultValue: formField.defaultValue,
            dropdownOptions: formField.dropdownOptions,
            falseOptionLabel: formField.falseOptionLabel,
            keyAlias: formField.keyAlias,
            maxAutosizeRows: formField.maxAutosizeRows,
            maxLength: formField.maxLength,
            minAutosizeRows: formField.minAutosizeRows,
            minLength: formField.minLength,
            required: formField.required,
            trueOptionLabel: formField.trueOptionLabel,
            value: formField.value,
            width: formField.width
        });
    }
}