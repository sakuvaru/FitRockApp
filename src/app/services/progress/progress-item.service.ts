import { Injectable } from '@angular/core';
import { ProgressItem } from '../../models';
import { RepositoryClient, PostQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

import { MultiSeriesResponse, SingleSeriesResponse} from './progress-models';

@Injectable()
export class ProgressItemService extends BaseTypeService<ProgressItem> {

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'ProgressItem',
            allowDelete: true
        });
    }

    getSingleSeriesStats(clientId: number, progressItemTypeId: number, from?: Date, to?: Date): PostQuery<SingleSeriesResponse> {
        const query = this.post<SingleSeriesResponse>('GetSingleSeriesStats')
            .withJsonOption('ClientId', clientId)
            .withJsonOption('progressItemTypeId', progressItemTypeId);

        if (from) {
            query.withJsonOption('from', from);
        }

        if (to) {
            query.withJsonOption('to', to);
        }

        return query;
    }

    getMultiSeriesStats(clientId: number, progressItemTypeId: number, from?: Date, to?: Date): PostQuery<MultiSeriesResponse> {
        const query = this.post<MultiSeriesResponse>('GetMultiSeriesStats')
            .withJsonOption('ClientId', clientId)
            .withJsonOption('progressItemTypeId', progressItemTypeId);

        if (from) {
            query.withJsonOption('from', from);
        }

        if (to) {
            query.withJsonOption('to', to);
        }

        return query;
    }
}
