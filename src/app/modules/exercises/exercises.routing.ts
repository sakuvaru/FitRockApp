import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// guard
import { AuthGuardService } from '../../../lib/auth';

// config
import { UrlConfig } from '../../core';

// workouts
import { SimpleLayoutComponent } from '../../layouts/simple-layout.component';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';

import { MyExerciseListComponent } from './list/my-exercise-list.component';
import { AllExerciseListComponent } from './list/all-exercise-list.component';
import { EditExerciseComponent } from './edit/edit-exercise.component';
import { NewExerciseComponent } from './new/new-exercise.component';
import { PreviewExerciseComponent } from './view/preview-exercise.component';

const routes: Routes = [
    {
        // workouts
        path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
            {
                path: 'exercises', component: MyExerciseListComponent
            },
            {
                path: 'exercises/all', component: AllExerciseListComponent
            },
            {
                path: 'exercises/new', component: NewExerciseComponent
            },
            {
                path: 'exercises/edit/:id', component: EditExerciseComponent
            },
            {
                path: 'exercises/preview/:id', component: PreviewExerciseComponent
            }
        ],
    },
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ExercisesRouter { }
