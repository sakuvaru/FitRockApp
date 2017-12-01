import { Injectable } from '@angular/core';

@Injectable()
export class SystemService {

  constructor(
  ) { }

  /**
   * Reload page with javascript (F5)
   */
  reloadPage(): void {
    document.location.reload(true);
  }

}
