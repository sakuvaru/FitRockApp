// common
import { Component, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../core/dynamic-form/base-field.class';
import { BaseComponent } from '../../core/base/base.component';
import { AppData } from '../../core/app-data.class';
import { ComponentDependencyService } from '../../core/component-dependency.service';

// required by component
import { UserFormsService } from '../../forms/user-forms.service';

@Component({
    templateUrl: 'new-client.component.html'
})
export class NewClientComponent extends BaseComponent{

    private insertFields: BaseField<any>[];

   constructor(
       private userFormsService: UserFormsService,
       protected componentDependencyService: ComponentDependencyService){
      super(componentDependencyService)

      this.userFormsService.getInsertFields().subscribe(fields => {
          this.insertFields = fields;
          // set trainer id
          var trainerIdField = this.insertFields.find(m => m.key == 'trainerId');
          trainerIdField.value = 1;
        });
   }

   initAppData(): AppData{
       return new AppData("Nový klient");
   }

   private handleInsert(form: FormGroup): void {
        this.userFormsService.saveInsertForm(form).subscribe(item => {
            console.log(item);
            this.showSavedSnackbar();
        });
    }
}