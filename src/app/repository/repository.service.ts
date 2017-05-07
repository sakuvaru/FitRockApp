import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ResponseSingle } from './response-single.class';
import { ResponseMultiple } from './response-multiple.class';
import { IOption } from './ioption.class';
import { AuthHttp } from 'angular2-jwt';
import { AppConfig } from '../core/config/app.config';
import { AppDataService } from '../core/app-data.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RepositoryService {

    private apiUrl = AppConfig.RepositoryApiEndpoint;

    // Observable string sources
    private processingRequestSource = new Subject<boolean>();

    // Observable string streams
    requestStateChanged$ = this.processingRequestSource.asObservable();

    // Service message commands
    finishRequest(): void {
        this.processingRequestSource.next(false);
    }

    startRequest(): void {
        this.processingRequestSource.next(true);
    }

    constructor(private authHttp: AuthHttp, private appDataService: AppDataService) {
    }

    private getBaseUrl(type: string): string {
        return this.apiUrl + "/" + type;
    }

    private addOptionsToUrl(url: string, options?: IOption[]): string {
        if (options) {
            options.forEach(filter => {
                if (url.indexOf('?') > -1) {
                    url = url + "&" + filter.GetParam() + "=" + filter.GetParamValue();
                }
                else {
                    url = url + "?" + filter.GetParam() + "=" + filter.GetParamValue();
                }
            });
        }
        return url;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred in "repository service"', error);
        return Promise.reject(error.message || error);
    }

    getAll(type: string, options?: IOption[]): Promise<ResponseMultiple> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + "/getall";

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => {
                this.finishRequest();
                return response.json() as ResponseMultiple;
            })
            .catch(this.handleError);
    }

    getByCodename(type: string, codename: string, options?: IOption[]): Promise<ResponseSingle> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + "/getbycodename/" + codename;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => {
                this.finishRequest();
                return response.json() as ResponseSingle;
            })
            .catch(this.handleError);
    }

    getByGuid(type: string, guid: string, options?: IOption[]): Promise<ResponseSingle> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + "/getbyguid/" + guid;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => {
                this.finishRequest();
                return response.json() as ResponseSingle;
            })
            .catch(this.handleError);
    }

    getById(type: string, id: number, options?: IOption[]): Promise<ResponseSingle> {
        // trigger request
        this.startRequest();

        var url = this.getBaseUrl(type) + "/getbyid/" + id;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => {
                this.finishRequest();
                return response.json() as ResponseSingle;
            })
            .catch(this.handleError);
    }
}