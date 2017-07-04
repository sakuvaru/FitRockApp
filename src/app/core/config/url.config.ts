
export class UrlConfig {

    public static PublicMasterPath = 'public';
    public static TrainerMasterPath = 'app/trainer';
    public static ClientMasterPath = 'app/client';

    public static Login = 'login';
    public static Error = 'error';
    public static Unauthorized = 'unauthorized';
    public static Logout = 'logout';
    public static NotFound = '404';
    public static Redirect = 'redirect';
    public static RedirectAfterLogout = UrlConfig.Login;
    public static Default = 'login';

    public static get404Url(){
        return '/' + UrlConfig.NotFound;
    }

    public static getErrorUrl(logGuid: string){
        return UrlConfig.getPublicUrl(UrlConfig.Error + '?g=' + logGuid)
    }

    public static getPublicUrl(action: string) {
        return UrlConfig.PublicMasterPath + '/' + action;
    }

    public static getTrainerUrl(action?: string): string {
        if (action){
            return UrlConfig.TrainerMasterPath + '/' + action;
        }
        return UrlConfig.TrainerMasterPath;
    }

    public static getClientUrl(action?: string): string {
        if (action){
            return UrlConfig.ClientMasterPath + '/' + action;
        }
        return UrlConfig.ClientMasterPath;
    }

    /*
       public static PublicPath = 'public';
   
       public static DefaultPath = 'login';
       public static NotFoundPath = 'notfound';
       public static UnauthorizedPath = 'unauthorized';
       public static LoginPath = 'login';
       public static LogoutPath = 'logout';
       public static RedirectAfterLogoutPath = 'login';
       public static ErrorPath = 'error';
   */
}