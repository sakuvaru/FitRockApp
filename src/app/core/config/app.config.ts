
export class AppConfig {
    // app
    public static AppName = 'Fit Rock';
    public static MainTitle = 'Menu';

    // web api config
    public static RepositoryApiEndpoint = 'http://localhost:61466/type';

    // auth0 config
    public static Auth0_Domain = 'fitrock.eu.auth0.com'; // domain for Auth0 authentication
    public static Auth0_ClientId = 'xL8rULh2SRyNvrkIoBpySaqUxyMHDyI2'; // id of Auth0 client
    public static Auth0_RedirectUri = 'http://localhost:4200/app/trainer' // call back URL (needs to be set in Auth0 client settings)
    public static Auth0_ResponseType = 'token id_token'; // get token & id_token from response
    public static Auth0_Scope = 'openid profile email'; // scope identifying attributes returned in id_token
    public static Auth0_UserPasswordConnectionName = 'Username-Password-Authentication';
    public static Auth0_GoogleConnectionName = 'google-oauth2';
    public static Auth0_FacebookConnectionName = 'facebook';
    public static Auth0_AccessTokenStorageName = 'access_token';
    public static Auth0_IdTokenStorageName = 'id_token';
    public static Auth0_NoJwtError = true;
}
