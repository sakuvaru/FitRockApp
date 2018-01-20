import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthenticationPagesModule } from './authentication/authentication-pages.module';
import { ChatPagesModule } from './chat/chat-pages.module';
import { ClientsPagesModule } from './clients/clients-pages.module';
import { DashboardPagesModule } from './dashboard/dashboard-pages.module';
import { DietPagesModule } from './diets/diet-pages.module';
import { ExercisesModule } from './exercises/exercise-pages.module';
import { FoodPagesModule } from './foods/food-pages.module';
import { LocationPagesModule } from './locations/location-pages.module';
import { ProfilePagesModule } from './profile/profile-pages.module';
import { ProgressItemTypePagesModule } from './progress-item-types/progress-item-type-pages.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClientsPagesModule,
        ChatPagesModule,
        DashboardPagesModule,
        DietPagesModule,
        ExercisesModule,
        FoodPagesModule,
        LocationPagesModule,
        AuthenticationPagesModule,
        ProfilePagesModule,
        ProgressItemTypePagesModule
    ]
})
export class PagesModule { }
