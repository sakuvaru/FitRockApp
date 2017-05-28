import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Covalent modules for Angular2
import { CovalentCoreModule } from '@covalent/core';

// Angular material
// https://github.com/angular/material2
import { AngularMaterialModule } from '../../material/angular-material.module';

// services
import { FieldControlService } from './field-control.service';

// components
// NOTE: see https://angular.io/docs/ts/latest/cookbook/dynamic-form.html for more details
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';
import { DynamicFormComponent } from './dynamic-form.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule, // router module needs to be exported along with the layouts so that router-outlet can be used
        CovalentCoreModule, // covalent needs to be imported here as well because templates are using its modules
        FormsModule,
        ReactiveFormsModule, // required by dynamic forms feature
        AngularMaterialModule // all of material design modules
    ],
    declarations: [
        DynamicFormQuestionComponent,
        DynamicFormComponent
    ],
    providers: [
        FieldControlService
    ],
    exports: [
        DynamicFormQuestionComponent,
        DynamicFormComponent,
    ]
})
export class DynamicFormModule { }