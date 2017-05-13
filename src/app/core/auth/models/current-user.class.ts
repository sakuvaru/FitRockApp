export class CurrentUser{

    public codename;

    constructor(
        public isAuthenticated: boolean,
        public email?: string,
        public nickname?: string
    ){
        // codename = e-mail
        this.codename = email;
    }
}