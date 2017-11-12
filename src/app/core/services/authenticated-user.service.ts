import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../models/core.models';
import { SharedService } from './shared.service';

/// Service that provides the currently authenticated user
/// Has to be initialized after the user is logged in using the 'setUser' method
@Injectable()
export class AuthenticatedUserService {

    /**
     * Name of the local storage key where authenticated user is stored
     */
    private readonly authUserStorageKey = 'auth_user';

    constructor(
        private sharedService: SharedService
    ) {
    }

    /**
     * Gets current user from local storage
     */
    getUser(): AuthenticatedUser | null {
        return this.getUserFromLocalStorage();
    }

    /**
     * Updates avatar of current user in local storage.
     * This method should be called each time avatar is changed so that
     * new avatar can be displayed instead of the old one
     * @param avatarUrl Avatar url
     */
    updateAvatar(avatarUrl: string): void {
        const user = this.getUser();
        if (user) {
            user.avatarUrl = avatarUrl;
            this.setUser(user);
        }
    }

    /**
     * Gets current user id or 0 if none is found
     */
    public getUserId(): number {
        const user = this.getUser();
        if (!user) {
            return 0;
        }
        return user.id;
    }

    public setUser(user: AuthenticatedUser): void {
        this.saveUserToStorage(user);

        // notify shared service that user has been changed
        this.sharedService.setAuthenticatedUser(user);
    }

    private saveUserToStorage(user: AuthenticatedUser): void {
        localStorage.setItem(this.authUserStorageKey, JSON.stringify(user));
    }

    private getUserFromLocalStorage(): AuthenticatedUser | null {
        const userJson = localStorage.getItem(this.authUserStorageKey);
        if (!userJson) {
            return null;
        }

        const userAs = JSON.parse(userJson) as AuthenticatedUser;

        return new AuthenticatedUser(userAs.id, userAs.email, userAs.firstName, userAs.lastName, userAs.trainerId, userAs.isClient, userAs.avatarUrl);
    }
}
