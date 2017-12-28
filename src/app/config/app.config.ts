import { UrlConfig } from './url.config';
import { ControllerModel } from '../../lib/repository';

export class AppConfig {
    // dev
    public static DevModeEnabled = true;
    public static RedirectToErrorPageOnError = false;

    // app
    public static AppName = 'Fit Rock';
    public static MainTitle = 'Menu';
    public static DefaultLanguage = 'cs';
    public static RedirectQueryString = 'url';

    // web api config
    public static ServerUrl = 'http://localhost:61466';
    public static RepositoryUrl = AppConfig.ServerUrl;
    public static RepositoryTypeEndpoint = 'type';
    public static RepositoryApiEndpoint = 'api';

    // auth0 config
    public static Auth0_Domain = 'fitrock.eu.auth0.com'; // domain for Auth0 authentication
    public static Auth0_ClientId = 'xL8rULh2SRyNvrkIoBpySaqUxyMHDyI2'; // id of Auth0 client
    public static Auth0_RedirectUri = 'http://localhost:4200/' + UrlConfig.EntryPath; // call back URL (needs to be set in Auth0 client settings)
    public static Auth0_ResponseType = 'token id_token'; // get token & id_token from response
    public static Auth0_Scope = 'openid profile email'; // scope identifying attributes returned in id_token
    public static Auth0_UserPasswordConnectionName = 'Username-Password-Authentication';
    public static Auth0_GoogleConnectionName = 'google-oauth2';
    public static Auth0_FacebookConnectionName = 'facebook';
    public static Auth0_AccessTokenStorageName = 'access_token';
    public static Auth0_IdTokenStorageName = 'id_token';
    public static Auth0_NoJwtError = true;

    /**
     * Api key for goole project
     */ 
    public static GoogleApiKey = 'AIzaSyAK2PNZZv81SJcys-szVyNr-yc-CPPf00s';

    /**
     * Path to controller & action that is used to verify if server is running or not
     */
    public static ServerCheckerController = new ControllerModel('Server', 'IsRunning');

    /**
     * Indicates if the content page is hidden while components are still initializing
     */
    public static HideComponentWhenLoaderIsEnabled = true;

    /**
     * Dialog panel class
     */
    public static DefaultDialogPanelClass = 'w-dialog-panel';

    /**
     * Default url to image used as avatar
     */
    public static DefaultUserAvatarUrl = AppConfig.ServerUrl + '/system/images/default_avatar.png';

     /**
     * No data image url
     */
    public static NoDataImageUrl = AppConfig.ServerUrl + '/system/images/empty.png';

    
     /**
     * App logo url
     */
    public static AppLogoUrl = 'http://fuse-angular-material.withinpixels.com/assets/images/logos/fuse.svg';
}
