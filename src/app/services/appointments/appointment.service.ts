import { Injectable } from '@angular/core';
import { Appointment } from '../../models';
import { RepositoryClient, MultipleItemQuery } from '../../../lib/repository';
import { BaseTypeService } from '../base/base-type.service';

import { CalendarBuilder } from '../../../web-components/calendar';

@Injectable()
export class AppointmentService extends BaseTypeService<Appointment> {

    constructor(repositoryClient: RepositoryClient) {
        super(repositoryClient, {
            type: 'Appointment',
            allowDelete: true
        });
    }
}
