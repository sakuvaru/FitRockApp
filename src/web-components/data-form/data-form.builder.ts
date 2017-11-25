import { DataFormConfig } from './data-form.config';
import {
    DataFormEditResponse, DataFormInsertResponse, DataFormField, DataFormEditDefinition,
    DataFormInsertDefinition, DataFormDeleteResponse
} from './data-form-models';
import { Observable } from 'rxjs/Rx';
import { ResponseFormEdit, ResponseFormInsert, IItem } from '../../lib/repository';

export class DataFormBuilder<TItem extends IItem> {

    private config: DataFormConfig;

    constructor(
        isEditForm: boolean,
        isInsertForm: boolean,
        formDefinition: Observable<ResponseFormEdit<TItem> | ResponseFormInsert>
    ) {
        this.config = new DataFormConfig();

        // set form status
        this.config.isEditForm = isEditForm;
        this.config.isInsertForm = isInsertForm;

        // assign form definition
       this.config.formDefinition = this.getFormDefinition(formDefinition);
    }

    /**
    * Called when a value in a field changes.
    * Can also be used to dynamically change other fields in form
    */
    onFieldValueChange(callback: (config: DataFormConfig, changedField: DataFormField, newValue: string | Date | number | boolean) => Observable<void>): this {
        this.config.onFieldValueChange = callback;
        return this;
    }

    /**
    * Resolver used to change the value of certain fields manually
    */
    fieldValueResolver(resolver: (fieldName: string, value: string | number | boolean | Date) => Observable<string | boolean | number>): this {
        this.config.fieldValueResolver = resolver;
        return this;
    }

    wrapInCard(wrap: boolean): this {
        this.config.wrapInCard = wrap;
        return this;
    }

    build(): DataFormConfig {
        return this.config;
    }

    private getFormDefinition(formDefinition: Observable<ResponseFormEdit<TItem> | ResponseFormInsert>): Observable<DataFormEditDefinition | DataFormInsertDefinition> {
        return formDefinition.map(response => {
            if (response instanceof ResponseFormEdit) {
                return new DataFormEditDefinition(response.fields.map(
                    repoField => new DataFormField(
                        repoField.key, repoField.required
                    )
                 ));
            }

            if (response instanceof ResponseFormInsert) {
                return new DataFormInsertDefinition(response.fields.map(
                    repoField => new DataFormField(
                        repoField.key, repoField.required
                    )
                 ));
            }

            throw Error(`Unsupported form definition`);
        });
    }
}
