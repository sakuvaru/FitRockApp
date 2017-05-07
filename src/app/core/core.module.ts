import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDataService } from './app-data.service';
import { ComponentDependencyService } from './component-dependency.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
    ],
    providers:[
        AppDataService,
        ComponentDependencyService
    ]
})
export class CoreModule { }