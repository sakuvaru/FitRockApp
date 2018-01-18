import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LoginModule } from './login/login.module';
import { ClientsModule } from './clients/clients.module';
import { WorkoutsModule } from './/workouts/workouts.module';
import { ExercisesModule } from './exercises/exercises.module';
import { DietsModule } from './diets/diets.module';
import { FoodsModule } from './foods/foods.module';
import { ProgressItemTypesModule } from './progress-item-types/progress-item-types.module';
import { ProfileModule } from './profile/profile.module';
import { LocationModule } from './locations/location.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChatModule,
        SharedModule,
        DashboardModule,
        LoginModule,
        ClientsModule,
        WorkoutsModule,
        ExercisesModule,
        DietsModule,
        FoodsModule,
        ProgressItemTypesModule,
        ProfileModule,
        ChatModule,
        LocationModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ChatModule,
        SharedModule,
        DashboardModule,
        LoginModule,
        ClientsModule,
        WorkoutsModule,
        ExercisesModule,
        DietsModule,
        FoodsModule,
        ProgressItemTypesModule,
        ProfileModule,
        ChatModule,
        LocationModule,
    ]
})
export class ModulesModule { }
