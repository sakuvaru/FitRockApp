import { DynamicFormEditBuilder, DynamicFormInsertBuilder } from './dynamic-form-builder';
import { IItem, ResponseFormEdit, ResponseFormInsert, ResponseCreate, ResponseEdit } from '../../lib/repository';
import { Observable } from 'rxjs/Rx';

export class DynamicFormService {

    /**
     * Gets insert form builder
     * @param type Type of the item (e.g. 'workout')
     * @param insertFormDefinition Query to get the insert form definition  
     * @param insertFunction Function to be called when saving new item
     */
    insertForm<TItem extends IItem>(
        /**
        * Type of the item (codename)
        */
        type: string,
        /**
        * Function/Query used to fetch insert form definition from server
        */
        insertFormDefinition: Observable<ResponseFormInsert>,
        /**
         * Function used to insert a new object
         */
        insertFunction: (item: any) => Observable<ResponseCreate<TItem>>
    ): DynamicFormInsertBuilder<TItem> {
        return new DynamicFormInsertBuilder<TItem>(type, insertFormDefinition, insertFunction);
    }

    /**
     * Gets edit form builder
     * @param type Type of the item (e.g. 'workout')
     * @param editFormDefinition Query to get the edit form definition
     * @param editFunction Function to be called when saving an item
     */
    editForm<TItem extends IItem>(
        /**
        * Type of the item (codename)
        */
        type: string,
        /**
        * Function/Query used to fetch edit form definition from server
        */
        editFormDefinition: Observable<ResponseFormEdit<TItem>>,
        /**
         * Function used to edit given object
         */
        editFunction: (item: any) => Observable<ResponseEdit<TItem>>
    ): DynamicFormEditBuilder<TItem> {
        return new DynamicFormEditBuilder<TItem>(type, editFormDefinition, editFunction);
    }
}