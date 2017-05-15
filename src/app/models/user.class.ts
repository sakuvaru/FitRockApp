import { IItem } from '../repository/iitem.class';
import { BaseField } from '../core/dynamic-form/base-field.class';

export class User implements IItem {

    public codename: string;
    public guid: string;
    public created: Date;
    public updated: Date;
    public id: number;
    public fistName: string;
    public lastName: string;
    public email: string;
    public isClient: boolean;
    public isAdmin: boolean;
    public trainerUserId: number;
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
            fistName?: string;
            lastName?: string;
            email?: string;
            isClient?: boolean;
            isAdmin?: boolean;
            trainerUserId?: number;
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