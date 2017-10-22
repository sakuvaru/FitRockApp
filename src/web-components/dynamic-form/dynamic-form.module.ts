import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedWebComponentModule } from '../shared-web-components.module';

// services
import { DynamicFormService } from './dynamic-form.service';

// components
// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { DynamicFormComponent } from './dynamic-form.component';

// form controls
import { TextComponent } from './form-controls/text.component';
import { BooleanComponent } from './form-controls/boolean.component';
import { RadioBooleanComponent } from './form-controls/radio-boolean.component';
import { DateComponent } from './form-controls/date.component';
import { TextAreaComponent } from './form-controls/text-area.component';
import { DropdownComponent } from './form-controls/dropdown.component';
import { HiddenComponent } from './form-controls/hidden.component';
import { NumberComponent } from './form-controls/number.component';

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
        MessagesModule
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
        NumberComponent
    ],
    providers: [
        DynamicFormService
    ],
    exports: [
        DynamicFormQuestionComponent,
        DynamicFormComponent,
    ]
})
export class DynamicFormModule { }
