import { FormControl, FormGroup, Validators } from '@angular/forms';

import { BaseField } from '../../repository';

export class FieldControlService {
  constructor() { }

  toFormGroup(fields: BaseField<any>[]) {
    let group: any = {};

    if (fields) {
      fields.forEach(question => {
        group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || '');
      });
    }

    return new FormGroup(group);
  }
}