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

// loader
import { LoaderModule } from '../loader/loader.module';

// buttons
import { ButtonsModule} from '../buttons/buttons.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, // router module needs to be exported along with the layouts so that router-outlet can be used
        SharedWebComponentModule,
        FormsModule,
        ReactiveFormsModule, // required by dynamic forms feature
        LoaderModule,
        ButtonsModule
    ],
    declarations: [
        DynamicFormQuestionComponent,
        DynamicFormComponent
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
