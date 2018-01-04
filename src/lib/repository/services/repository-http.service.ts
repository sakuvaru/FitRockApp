import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { IRepositoryHttpService } from '../interfaces/irepository-http.service';
import { IRepositoryHttpServiceConfig } from '../interfaces/irepository-http-service.config';

class Header {
    constructor(
        public name: string,
        public value: string
    ) { }
}

export class RepositoryHttpService implements IRepositoryHttpService {

    constructor(
        private http: Http,
        private getAuthorizationToken: () => string | null,
        private options?: IRepositoryHttpServiceConfig
    ) { 
    }

    public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.get(url, this.processOptions(options));
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.post(url, body, this.processOptions(options));
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.put(url, body, this.processOptions(options));
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.delete(url, this.processOptions(options));
    }

    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.patch(url, body, this.processOptions(options));
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.http.head(url, this.processOptions(options));
    }

    private processOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
        // make sure options exist
        if (!options) {
            options = {};
        }

        // make sure headers exist
        if (!options.headers) {
            options.headers = new Headers();
        }

        // get authorization header
        const authorizationToken: string | null = this.getAuthorizationToken();

        if (!authorizationToken && this.options && this.options.throwErrorOnMissingJwtToken) {
            throw Error(`Authorization header is missing`);
        }

        if (authorizationToken) {
            const authorizationHeader: Header = this.getAuthorizationHeader(authorizationToken);
            options.headers.append(authorizationHeader.name, authorizationHeader.value);
        }

        // add authorization header

       return options;
    }

    private getAuthorizationHeader(token: string): Header {
        return new Header('Authorization', `Bearer ${token}`);    
    }
}
