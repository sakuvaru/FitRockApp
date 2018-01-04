import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { TokenService } from 'lib/auth';
import { RepositoryHttpService } from 'lib/repository/services/repository-http.service';

import { RepositoryClient, RepositoryConfig, TypeResolver } from '../../../lib/repository';
import { AppConfig } from '../../config';
import {
    Appointment,
    ChatMessage,
    Diet,
    DietCategory,
    DietFood,
    Exercise,
    ExerciseCategory,
    Feed,
    FileRecord,
    Food,
    FoodCategory,
    FoodDish,
    FoodUnit,
    Location,
    Log,
    ProgressItem,
    ProgressItemType,
    ProgressItemUnit,
    User,
    Workout,
    WorkoutCategory,
    WorkoutExercise,
} from '../../models';

export function RepositoryClientFactory(http: Http, tokenService: TokenService) {

    const apiUrl = AppConfig.RepositoryUrl;
    const typeEndpoint = AppConfig.RepositoryTypeEndpoint;
    const apiEndpoint = AppConfig.RepositoryApiEndpoint;

    const typeResolvers: TypeResolver[] = [
        new TypeResolver('User', () => new User()),
        new TypeResolver('Log', () => new Log()),
        new TypeResolver('Workout', () => new Workout()),
        new TypeResolver('WorkoutCategory', () => new WorkoutCategory()),
        new TypeResolver('WorkoutExercise', () => new WorkoutExercise()),
        new TypeResolver('Exercise', () => new Exercise()),
        new TypeResolver('ExerciseCategory', () => new ExerciseCategory()),
        new TypeResolver('Diet', () => new Diet()),
        new TypeResolver('DietCategory', () => new DietCategory()),
        new TypeResolver('DietFood', () => new DietFood()),
        new TypeResolver('Food', () => new Food()),
        new TypeResolver('FoodCategory', () => new FoodCategory()),
        new TypeResolver('FoodUnit', () => new FoodUnit()),
        new TypeResolver('ProgressItem', () => new ProgressItem()),
        new TypeResolver('ProgressItemType', () => new ProgressItemType()),
        new TypeResolver('ProgressItemUnit', () => new ProgressItemUnit()),
        new TypeResolver('ChatMessage', () => new ChatMessage()),
        new TypeResolver('Feed', () => new Feed()),
        new TypeResolver('FileRecord', () => new FileRecord()),
        new TypeResolver('Appointment', () => new Appointment()),
        new TypeResolver('Location', () => new Location()),
        new TypeResolver('FoodDish', () => new FoodDish())
    ];

    return new RepositoryClient(
        new RepositoryHttpService(http, () => tokenService.getIdToken(), {
            throwErrorOnMissingJwtToken: false
        }),
        new RepositoryConfig(apiUrl, typeEndpoint, apiEndpoint, typeResolvers, {
            logErrorsToConsole: AppConfig.DevModeEnabled
        })
    );
}

export let RepositoryClientProvider = {
    provide: RepositoryClient,
    useFactory: RepositoryClientFactory,
    deps: [Http, TokenService]
};

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        RepositoryClient,
    ],
})
export class RepositoryClientProviderModule { }
