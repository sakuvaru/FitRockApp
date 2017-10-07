// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// config
import { RepositoryConfig, TypeResolver, RepositoryClient } from '../../../lib/repository';
import { AppConfig } from '../../core/config/app.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import {
    User, Log, Workout, WorkoutCategory, Exercise, ExerciseCategory, WorkoutExercise,
    Diet, DietCategory, DietFood, Food, FoodCategory, FoodUnit, ProgressItem, ProgressItemType,
    ProgressItemUnit, ChatMessage, Feed, FileRecord
} from '../../models';

export function RepositoryClientFactory(authHttp: AuthHttp) {

    const apiUrl = AppConfig.RepositoryApiEndpoint;
    const typeEndpoint = AppConfig.RepositoryTypeEndpoint;

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
    ];

    return new RepositoryClient(
        authHttp,
        new RepositoryConfig(apiUrl, typeEndpoint, typeResolvers, {
            logErrorsToConsole: AppConfig.DevModeEnabled
        })
    );
}

export let RepositoryClientProvider = {
    provide: RepositoryClient,
    useFactory: RepositoryClientFactory,
    deps: [AuthHttp]
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
