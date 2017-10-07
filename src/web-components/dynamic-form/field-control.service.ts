import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormField } from '../../lib/repository';

export class FieldControlService {
  constructor() { }

  toFormGroup(fields: FormField[]): FormGroup {
    const group: any = {};

    if (fields) {
      fields.forEach(question => {
        group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
      });
    }

    return new FormGroup(group);
  }
}
