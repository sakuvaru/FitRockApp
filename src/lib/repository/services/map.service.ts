import { TypeResolver } from '../models/type-resolver.class';
import { TypeResolverService } from './type-resolver.service';
import { IItem } from '../interfaces/iitem.interface';

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
}