// core
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

// config
import { RepositoryConfig } from '../../repository/repository.config';
import { TypeResolver } from '../../repository/type-resolver.class';
import { AppConfig } from '../../core/config/app.config';

// services
import { RepositoryService } from '../../repository/repository.service';
import { AppDataService } from '../../core/app-data.service';
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
