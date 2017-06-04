import { Injectable } from '@angular/core';
import { ColumnValidation, FieldErrorEnum } from '../../repository.lib';

Injectable()
export class FormTranslationService {

    getFormErrorMessage(columnValidation: ColumnValidation, fieldLabel: string) {
        return this.getFormFieldErrorMessage(columnValidation, fieldLabel);
    }

    getFormFieldErrorMessage(columnValidation: ColumnValidation, fieldLabel?: string): string {

        if (columnValidation.errorType === FieldErrorEnum.InvalidCodename) {
            if (fieldLabel) {
                return `Pole '${fieldLabel}' může obsahovat pouze písmena a číslice (bez mezer a speciálních znaků)`;
            }
            return `Pole může obsahovat pouze písmena a číslice (bez mezer a speciálních znaků)`;
        }

        if (columnValidation.errorType === FieldErrorEnum.InvalidEmail) {
            if (fieldLabel) {
                return `Pole '${fieldLabel}' musí být validní e-mail`;
            }
            return `Zadaný e-mail není validní`;
        }

        if (columnValidation.errorType === FieldErrorEnum.NotUnique) {
            if (fieldLabel) {
                return `Hodnota pro '${fieldLabel}' je již zabraná, zkus něco jiného`;
            }
            return `Tato hodnota je již zabraná, zkus něco jiného`;
        }

        if (columnValidation.errorType === FieldErrorEnum.Other) {
            if (fieldLabel) {
                return `Pole '${fieldLabel}' je chybně vyplněno`;
            }
            return `Pole je chybně vyplněno`;
        }

        return `Neznámá chyba`;
    }
}