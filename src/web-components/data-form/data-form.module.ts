import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { DateTimePickerModule } from 'ng-pick-datetime';

import { ButtonsModule } from '../buttons/buttons.module';
import { LoaderModule } from '../loader/loader.module';
import { MessagesModule } from '../messages/messages.module';
import { SharedWebComponentModule } from '../shared-web-components.module';
import { DataFormFieldComponent } from './data-form-field.component';
import { DataFormComponent } from './data-form.component';
import { DataFormDeleteButtonDirective } from './directives/data-form-delete-button.directive';
import { DataFormSaveButtonDirective } from './directives/data-form-save-button.directive';
import { BooleanComponent } from './form-controls/boolean.component';
import { DateTimeComponent } from './form-controls/date-time.component';
import { DateComponent } from './form-controls/date.component';
import { DropdownComponent } from './form-controls/dropdown.component';
import { HiddenComponent } from './form-controls/hidden.component';
import { NumberComponent } from './form-controls/number.component';
import { PhoneNumberComponent } from './form-controls/phone-number.component';
import { RadioBooleanComponent } from './form-controls/radio-boolean.component';
import { TextAreaComponent } from './form-controls/text-area.component';
import { TextComponent } from './form-controls/text.component';
import { DurationComponent } from './form-controls/duration.component';
import { EmailComponent } from './form-controls/email.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, // router module needs to be exported along with the layouts so that router-outlet can be used
        SharedWebComponentModule,
        FormsModule,
        ReactiveFormsModule, // required by dynamic forms feature
        LoaderModule,
        ButtonsModule,
        MessagesModule,
        TextMaskModule,
        DateTimePickerModule
    ],
    declarations: [
        DataFormComponent,
        DataFormFieldComponent,
        DataFormSaveButtonDirective,
        DataFormDeleteButtonDirective,
        // form controls        
        TextComponent,
        BooleanComponent,
        RadioBooleanComponent,
        DateComponent,
        TextAreaComponent,
        DropdownComponent,
        HiddenComponent,
        NumberComponent,
        PhoneNumberComponent,
        DateTimeComponent,
        DurationComponent,
        EmailComponent
    ],
    exports: [
        DataFormComponent,
        DataFormSaveButtonDirective,
        DataFormDeleteButtonDirective
    ]
})
export class DataFormModule { }
