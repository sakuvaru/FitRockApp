export class Auth0User {

    constructor(
        public isAuthenticated: boolean,
        public emailVerified: boolean,
        public picture: string,
        public email: string,
        public nickname: string,
        public firstName: string,
        public lastName: string,
        public isFemale: boolean
    ) {
    }
}
