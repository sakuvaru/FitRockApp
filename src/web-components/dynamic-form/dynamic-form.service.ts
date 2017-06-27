import { DynamicFormEditBuilder, DynamicFormInsertBuilder } from './dynamic-form-builder';
import { IItem } from '../../lib/repository';

export class DynamicFormService {

    insertForm<T extends IItem>(): DynamicFormInsertBuilder<T> {
        return new DynamicFormInsertBuilder<T>();
    }

    editForm<T extends IItem>(): DynamicFormEditBuilder<T> {
        return new DynamicFormEditBuilder<T>();
    }
}