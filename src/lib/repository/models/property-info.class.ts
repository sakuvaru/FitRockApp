import { IPropertyInfo } from '../interfaces/iproperty-info.interface';

export class PropertyInfo implements IPropertyInfo {
    constructor(
        public name: string,
        public propertyType: string
    ) { }
}