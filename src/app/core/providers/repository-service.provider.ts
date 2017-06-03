// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// config
import { RepositoryConfig, TypeResolver, RepositoryService } from '../../../lib/repository.lib';
import { AppConfig } from '../../core/config/app.config';

// services
import { AppDataService } from '../app-data/app-data.service';
import { AuthHttp } from 'angular2-jwt';

// models
import { User } from '../../models/user.class';
import { Log } from '../../models/log.class';

export function RepositoryServiceFactory(authHttp: AuthHttp) {

    let apiUrl = AppConfig.RepositoryApiEndpoint;

    let typeResolvers: TypeResolver[] = [
        new TypeResolver("user", () => new User()),
        new TypeResolver("log", () => new Log()),
    ];

    return new RepositoryService(
        authHttp,
        new RepositoryConfig(apiUrl, typeResolvers)
    )
};

export var RepositoryServiceProvider =
    {
        provide: RepositoryService,
        useFactory: RepositoryServiceFactory,
        deps: [AuthHttp]
    };

@NgModule({
    imports: [
    ],
    declarations: [
    ],
    providers: [
        RepositoryService,
    ],
})
export class RepositoryServiceProviderModule{ }
