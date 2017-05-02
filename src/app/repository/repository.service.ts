import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ResponseSingle } from './response-single.class';
import { ResponseMultiple } from './response-multiple.class';
import { IOption } from './ioption.class';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RepositoryService {

    private apiUrl = "http://localhost:61466/type";

    constructor(private authHttp: AuthHttp) { }

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
        var url = this.getBaseUrl(type) + "/getall";

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => response.json() as ResponseMultiple)
            .catch(this.handleError);
    }


    getByCodename(type: string, codename: string, options?: IOption[]): Promise<ResponseSingle> {
        var url = this.getBaseUrl(type) + "/getbycodename/" + codename;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => (response.json() as ResponseSingle))
            .catch(this.handleError);
    }

    getByGuid(type: string, guid: string, options?: IOption[]): Promise<ResponseSingle> {
        var url = this.getBaseUrl(type) + "/getbyguid/" + guid;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => (response.json() as ResponseSingle))
            .catch(this.handleError);
    }

    getById(type: string, id: number, options?: IOption[]): Promise<ResponseSingle> {
        var url = this.getBaseUrl(type) + "/getbyid/" + id;

        url = this.addOptionsToUrl(url, options);

        return this.authHttp.get(url)
            .toPromise()
            .then(response => (response.json() as ResponseSingle))
            .catch(this.handleError);
    }
}