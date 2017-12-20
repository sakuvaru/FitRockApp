export class CurrentUser {

    public codename;

    constructor(
        public isAuthenticated: boolean,
        public emailVerified: boolean,
        public picture: string,
        public email: string,
        public nickname: string
    ) {
        // codename = e-mail
        this.codename = email;
    }
}
