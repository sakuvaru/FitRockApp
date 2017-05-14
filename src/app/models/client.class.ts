import { IItem } from '../repository/iitem.class';
import { BaseField } from '../core/dynamic-form/base-field.class';

export class Client implements IItem {

    public codename: string;
    public guid: string;
    public created: Date;
    public updated: Date;
    public id: number;
    public trainerId: number;
    public birthDate: Date;
    public isFemale: boolean;
    public city: string;
    public address: string;
    public fitnessLevel: string;
    public medicalCondition: string;
    public goal: string;
    public trainerPublicNotes: string;

    constructor(
        public fields?: {
            user?: string,
            stacktrace?: string,
            errorMessage?: string,
            id?: number,
            trainerId: number,
            birthDate?: Date,
            isFemale?: boolean,
            city?: string,
            address?: string,
            fitnessLevel?: string,
            medicalCondition?: string,
            goal?: string,
            trainerPublicNotes?: string,
        }) {
        if (fields) Object.assign(this, fields);
    }
}