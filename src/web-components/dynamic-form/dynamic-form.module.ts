import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Shared web components
import { SharedWebComponentModule } from '../shared-web-components.module';

// Dynamic form
// see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { DynamicFormComponent } from './dynamic-form.component';

// Date time picker
// see https://www.npmjs.com/package/ng-pick-datetime
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateTimePickerModule } from 'ng-pick-datetime';

// Angular input mask
// see https://github.com/text-mask/text-mask/tree/master/angular2#readme 
import { TextMaskModule } from 'angular2-text-mask';

// form controls
import { TextComponent } from './form-controls/text.component';
import { BooleanComponent } from './form-controls/boolean.component';
import { RadioBooleanComponent } from './form-controls/radio-boolean.component';
import { DateComponent } from './form-controls/date.component';
import { TextAreaComponent } from './form-controls/text-area.component';
import { DropdownComponent } from './form-controls/dropdown.component';
import { HiddenComponent } from './form-controls/hidden.component';
import { NumberComponent } from './form-controls/number.component';
import { PhoneNumberComponent } from './form-controls/phone-number.component';
import { DateTimeComponent } from './form-controls/date-time.component';

// loader
import { LoaderModule } from '../loader/loader.module';

// buttons
import { ButtonsModule} from '../buttons/buttons.module';

// messages
import { MessagesModule } from '../messages/messages.module';

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
        DynamicFormQuestionComponent,
        DynamicFormComponent,
        TextComponent,
        BooleanComponent,
        RadioBooleanComponent,
        DateComponent,
        TextAreaComponent,
        DropdownComponent,
        HiddenComponent,
        NumberComponent,
        PhoneNumberComponent,
        DateTimeComponent
    ],
    exports: [
        DynamicFormQuestionComponent,
        DynamicFormComponent,
    ]
})
export class DynamicFormModule { }
