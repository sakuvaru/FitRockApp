import { Inject } from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter } from 'angular-calendar';
import { LocalizationService } from 'lib/localization';
import { CalendarEventModel } from './calendar.models';

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {

  private locale: string = 'en';

  private readonly defaultLocale: string = 'en';

  constructor( @Inject(LocalizationService) private localizationService: LocalizationService) {
    super();
    // set locale
    this.locale = localizationService.getLocale();
  }

  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    const eventModel = event.meta.eventModel as CalendarEventModel<any>;
    return `<b>${new Intl.DateTimeFormat(this.locale ? this.locale : this.defaultLocale, {
      hour: 'numeric',
      minute: 'numeric'
    }).format(event.start)}</b> <span>${eventModel.eventUsername}</span> - ${event.title}`;
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
