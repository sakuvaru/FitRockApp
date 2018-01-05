import { BaseItem, LanguageEnum, languageHelper } from '../../lib/repository';

export class User extends BaseItem {

    public firstName: string;
    public lastName: string;
    public email: string;
    public isClient: boolean;
    public isAdmin: boolean;
    public trainerUserId: number;
    public birthDate?: Date;
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
    public language: number;
    public gravatarUrl: string;
    public license: number;
    public licenseString: string;

    getLanguageEnum(): LanguageEnum {
        return languageHelper.getLanguage(this.language);
    }

    /**
     * Gets either avatar or gravatar url.
     * Avatar has priority
     */
    getAvatarOrGravatarUrl(): string | undefined {
        if (this.avatarUrl) {
            return this.avatarUrl;
        }

        return this.gravatarUrl;
    }

    getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}

export class UserFilterWithCount {
    public filter: string;
    public userCount: number;
}
