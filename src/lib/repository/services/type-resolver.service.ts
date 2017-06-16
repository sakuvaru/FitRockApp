import { TypeResolver } from '../models/type-resolver.class';
import { IItem } from '../interfaces/iitem.interface';



export class TypeResolverService {
    constructor(
        private typeResolvers: TypeResolver[]
    ) {
    }

    createTypedObj<TItem extends IItem>(type: string, item: IItem): TItem {
        if (!type) {
            throw Error('Cannot resolve type because no type name was provided');
        }

        var typeResolver = this.typeResolvers.find(m => m.type.toLowerCase() === type.toLowerCase());

        if (!typeResolver) {
            throw new Error(`Cannot find resolver for type '${type}'`);
        }

        var typedItem = typeResolver.resolve() as TItem;

        return typedItem;
    }
}