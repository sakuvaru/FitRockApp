
export class AppConfig {
    // web api config
    public static RepositoryApiEndpoint = "http://localhost:61466/type";

    // auth0 config
    public static Auth0Endpoint = "https://fitrock.eu.auth0.com/oauth/ro";
    public static ClientId = "xL8rULh2SRyNvrkIoBpySaqUxyMHDyI2";

    // auth config -> https://github.com/auth0/angular2-jwt
    public static TokenName = "jwt_token";
    public static NoJwtError: true;
}
