// this class represents body of request send to Auth0 for authenticated
export class Auth0StandardRequestBody{

    public grant_type = "password";
    public scope = "openid profile email";
    public connection = "Username-Password-Authentication";

    constructor(
        public client_id: string,
        public username: string,
        public password: string
        ) {}
}