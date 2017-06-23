// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// config
import { RepositoryConfig, TypeResolver, RepositoryClient } from '../../../lib/repository';
import { AppConfig } from '../../core/config/app.config';

// services
import { AuthHttp } from 'angular2-jwt';

// models
import { User, Log, Workout, WorkoutCategory, Exercise, ExerciseCategory, WorkoutExercise } from '../../models';

export function RepositoryClientFactory(authHttp: AuthHttp) {

    let apiUrl = AppConfig.RepositoryApiEndpoint;

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("User", () => new User()),
        new TypeResolver("Log", () => new Log()),
        new TypeResolver("Workout", () => new Workout()),
        new TypeResolver("WorkoutCategory", () => new WorkoutCategory()),
        new TypeResolver("WorkoutExercise", () => new WorkoutExercise()),
        new TypeResolver("Exercise", () => new Exercise()),
        new TypeResolver("ExerciseCategory", () => new ExerciseCategory()),
    ];

    return new RepositoryClient(
        authHttp,
        new RepositoryConfig(apiUrl, typeResolvers, {
            logErrorsToConsole: AppConfig.DevModeEnabled
        })
    )
};

export var RepositoryClientProvider =
    {
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
export class RepositoryClientProviderModule{ }
