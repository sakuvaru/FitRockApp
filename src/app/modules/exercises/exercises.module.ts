import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// core module
import { CoreModule } from '../../core';

// components
import { MyExerciseListComponent } from './list/my-exercise-list.component';
import { AllExerciseListComponent } from './list/all-exercise-list.component';
import { EditExerciseComponent } from './edit/edit-exercise.component';
import { NewExerciseComponent } from './new/new-exercise.component';
import { PreviewExerciseComponent } from './view/preview-exercise.component';

// router
import { ExercisesRouter } from './exercises.routing';

// modules
import { SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        ExercisesRouter,
        SharedModule
    ],
    declarations: [
        MyExerciseListComponent,
        EditExerciseComponent,
        NewExerciseComponent,
        AllExerciseListComponent,
        PreviewExerciseComponent
    ]
})
export class ExercisesModule { }