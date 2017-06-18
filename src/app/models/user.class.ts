import { BaseItem } from '../../lib/repository';

export class User extends BaseItem {

    public firstName: string;
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
    public trainer: User;
    public isActive: boolean;

    constructor(
        public fields?: {
            id?: number,
            codename?: string,
            guid?: string,
            created?: Date,
            updated?: Date,
            firstName?: string;
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
            isActive?: boolean
        }) { super()
        if (fields) Object.assign(this, fields);
    }

    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}