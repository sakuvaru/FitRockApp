import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PagesCoreModule } from '../pages-core.module';
import { EditExercisePageComponent } from './edit/edit-exercise-page.component';
import { ExercisesRouter } from './exercises.routing';
import { AllExerciseListPageComponent } from './list/all-exercise-list-page.component';
import { MyExerciseListPageComponent } from './list/my-exercise-list-page.component';
import { NewExercisePageComponent } from './new/new-exercise-page.component';
import { PreviewExercisePageComponent } from './view/preview-exercise-page.component';

@NgModule({
    imports: [
        PagesCoreModule,
        CommonModule,
        ExercisesRouter,
    ],
    declarations: [
        MyExerciseListPageComponent,
        AllExerciseListPageComponent,
        EditExercisePageComponent,
        NewExercisePageComponent,
        PreviewExercisePageComponent
    ]
})
export class ExercisesModule { }
