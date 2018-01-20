import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuardService } from '../../../lib/auth';
import { UrlConfig } from '../../config';
import { AdminLayoutComponent } from '../../layouts/admin-layout.component';
import { EditExercisePageComponent } from './edit/edit-exercise-page.component';
import { AllExerciseListPageComponent } from './list/all-exercise-list-page.component';
import { MyExerciseListPageComponent } from './list/my-exercise-list-page.component';
import { NewExercisePageComponent } from './new/new-exercise-page.component';
import { PreviewExercisePageComponent } from './view/preview-exercise-page.component';

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild([
            {
                path: UrlConfig.TrainerMasterPath, component: AdminLayoutComponent, canActivate: [AuthGuardService], children: [
                    {
                        path: 'exercises', component: MyExerciseListPageComponent
                    },
                    {
                        path: 'exercises/all', component: AllExerciseListPageComponent
                    },
                    {
                        path: 'exercises/new', component: NewExercisePageComponent
                    },
                    {
                        path: 'exercises/edit/:id', component: EditExercisePageComponent
                    },
                    {
                        path: 'exercises/preview/:id', component: PreviewExercisePageComponent
                    }
                ],
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ExercisesRouter { }
