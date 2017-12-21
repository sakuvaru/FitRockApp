import { Inject } from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { LocalizationService } from 'lib/localization';
import { CalendarEventModel } from './calendar.models';
import * as moment from 'moment';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {

  private locale: string = 'en';

  private readonly defaultLocale: string = 'en';

  constructor( @Inject(LocalizationService) private localizationService: LocalizationService) {
    super();
    // set locale
    this.locale = localizationService.getLocale();
  }

  private getDurationTitle(startDate: Date, endDate: Date): string {
    const diffDate = moment(moment(endDate).locale(this.locale ? this.locale : this.defaultLocale).diff(startDate));
    // reduce hours by 1 to get correct value
    const hour = diffDate.hours() - 1;
    const minutes = diffDate.minutes();

    if (hour === 0 && minutes === 0) {
      return '';
    }

    return `(${hour}:${minutes})`;
  }

  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    const eventModel = event.meta.eventModel as CalendarEventModel<any>;
    const durationTitle = this.getDurationTitle(eventModel.date, eventModel.endDate);

    return `<b>${new Intl.DateTimeFormat(this.locale ? this.locale : this.defaultLocale, {
      hour: 'numeric',
      minute: 'numeric'
    }).format(event.start)}</b> ${durationTitle} <span>${eventModel.eventUsername}</span> - ${event.title}`;
  }

  week(event: CalendarEvent): string {
    const eventModel = event.meta.eventModel as CalendarEventModel<any>;
    return `<b>${new Intl.DateTimeFormat(this.locale ? this.locale : this.defaultLocale, {
      hour: 'numeric',
      minute: 'numeric'
    }).format(event.start)}</b> ${event.title} <span class="w-calendar-subtitle">${eventModel.eventUsername}</span>`;
  }

  day(event: CalendarEvent): string {
    const eventModel = event.meta.eventModel as CalendarEventModel<any>;
    return `<b>${new Intl.DateTimeFormat(this.locale ? this.locale : this.defaultLocale, {
      hour: 'numeric',
      minute: 'numeric'
    }).format(event.start)}</b> ${event.title} <span class="w-calendar-subtitle">${eventModel.eventUsername}</span>`;
  }
}
