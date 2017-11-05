import { BaseItem } from '../../lib/repository';

export class User extends BaseItem {

    public firstName: string;
    public lastName: string;
    public email: string;
    public isClient: boolean;
    public isAdmin: boolean;
    public trainerUserId: number;
    public birthDate: Date;
    public phoneNumber: string;
    public isFemale: boolean;
    public city: string;
    public address: string;
    public fitnessLevel: string;
    public medicalCondition: string;
    public goal: string;
    public trainerPublicNotes: string;
    public trainerPrivateNotes: string;
    public trainer: User;
    public isActive: boolean;
    public avatarUrl: string;

    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}

export class UserFilterWithCount {
    public filter: string;
    public userCount: number;
}
