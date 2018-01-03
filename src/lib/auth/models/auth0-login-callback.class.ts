import * as Auth0 from 'auth0-js';

export class Auth0LoginCallback {
    constructor(
        public error: Auth0.Auth0Error | null,
        public isSuccessful: boolean,
        public token: string | null
    ) {}
}
