import { AuthenticatedUser } from '../models/core.models';

/// Service that provides the currently authenticated user
/// Has to be initialized after the user is logged in using the 'setUser' method
export class AuthenticatedUserService {

    /**
     * Name of the local storage key where authenticated user is stored
     */
    private readonly authUserStorageKey = 'auth_user';

    constructor(
    ) {
    }

    /**
     * Gets current user from local storage
     */
    public getUser(): AuthenticatedUser | null {
        return this.getUserFromLocalStorage();
    }

    /**
     * Gets current user id or 0 if none is found
     */
    public getUserId(): number {
        var user = this.getUser();
        if (!user){
            return 0;
        }
        return user.id;
    }

    public setUser(user: AuthenticatedUser): void {
        this.saveUserToStorage(user);
    }

    private saveUserToStorage(user: AuthenticatedUser): void {
        localStorage.setItem(this.authUserStorageKey, JSON.stringify(user));
    }

    private getUserFromLocalStorage(): AuthenticatedUser | null {
        var userJson = localStorage.getItem(this.authUserStorageKey);
        if (!userJson) {
            return null;
        }

        var userAs = JSON.parse(userJson) as AuthenticatedUser;

        return new AuthenticatedUser(userAs.id, userAs.email, userAs.firstName, userAs.lastName, userAs.trainerId, userAs.avatarUrl);
    }
}