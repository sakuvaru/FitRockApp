import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreModule } from '../../core';
import { SharedModule } from '../shared/shared.module';
import { EditExerciseComponent } from './edit/edit-exercise.component';
import { AllExerciseListComponent } from './list/all-exercise-list.component';
import { MyExerciseListComponent } from './list/my-exercise-list.component';
import { NewExerciseComponent } from './new/new-exercise.component';
import { PreviewExerciseComponent } from './view/preview-exercise.component';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        SharedModule
    ],
    declarations: [
        MyExerciseListComponent,
        EditExerciseComponent,
        NewExerciseComponent,
        AllExerciseListComponent,
        PreviewExerciseComponent
    ],
    exports: [
        MyExerciseListComponent,
        EditExerciseComponent,
        NewExerciseComponent,
        AllExerciseListComponent,
        PreviewExerciseComponent
    ]
})
export class ExercisesModule { }
