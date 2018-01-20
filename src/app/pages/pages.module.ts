import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatPagesModule } from './chat/chat-pages.module';
import { ClientsPagesModule } from './clients/clients-pages.module';
import { DashboardPagesModule } from './dashboard/dashboard-pages.module';
import { DietPagesModule } from './diets/diet-pages.module';
import { ExercisesModule } from './exercises/exercise-pages.module';
import { FoodPagesModule } from './foods/food-pages.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClientsPagesModule,
        ChatPagesModule,
        DashboardPagesModule,
        DietPagesModule,
        ExercisesModule,
        FoodPagesModule
    ]
})
export class PagesModule { }
