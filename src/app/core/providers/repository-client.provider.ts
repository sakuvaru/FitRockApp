// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// config
import { RepositoryConfig, TypeResolver, RepositoryClient } from '../../../lib/repository';
import { AppConfig } from '../../core/config/app.config';

// services
import { AppDataService } from '../app-data/app-data.service';
import { AuthHttp } from 'angular2-jwt';

// models
import { User } from '../../models/user.class';
import { Log } from '../../models/log.class';

export function RepositoryClientFactory(authHttp: AuthHttp) {

    let apiUrl = AppConfig.RepositoryApiEndpoint;

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("user", () => new User()),
        new TypeResolver("log", () => new Log()),
    ];

    return new RepositoryClient(
        authHttp,
        new RepositoryConfig(apiUrl, typeResolvers)
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
