
export class UrlConfig {

    public static AppUrl = 'app';

    /**
    * Entry point to application after redirecting from Auth0
    */
    public static EntryPoint = UrlConfig.AppUrl + '/entry';

    public static TrainerMasterPath = UrlConfig.AppUrl + '/trainer';
    public static ClientMasterPath = UrlConfig.AppUrl + '/client';
    public static AuthMasterPath = UrlConfig.AppUrl + '/auth';

    public static Login = 'login';
    public static AppError = 'error';
    public static Unauthorized = 'unauthorized';
    public static Logout = 'logout';
    public static Item404 = '404';
    public static Global404 = '404';
    public static Redirect = 'redirect';
    public static RedirectAfterLogout = UrlConfig.Login;
    public static Default = 'login';

    public static AppErrorLogGuidQueryString = 'q';

    public static getUnAuthorizedUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Unauthorized);
    }

    public static getGlobal404(): string {
        return '/' + UrlConfig.Global404;
    }

    public static getLoginUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Login);
    }

    public static getLogoutUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Logout);
    }

    public static getItem404(): string {
        return UrlConfig.getAppUrl(UrlConfig.Item404);
    }

    public static getAppErrorUrl(): string {
        return UrlConfig.getAppUrl(UrlConfig.AppError);
    }

    public static getAppUrl(action: string): string {
        return UrlConfig.AppUrl + '/' + action;
    }

    public static getTrainerUrl(action?: string): string {
        if (action) {
            return UrlConfig.TrainerMasterPath + '/' + action;
        }
        return UrlConfig.TrainerMasterPath;
    }

    public static getClientUrl(action?: string): string {
        if (action) {
            return UrlConfig.ClientMasterPath + '/' + action;
        }
        return UrlConfig.ClientMasterPath;
    }

    public static getAuthUrl(action?: string): string {
        if (action) {
            return UrlConfig.AuthMasterPath + '/' + action;
        }
        return UrlConfig.AuthMasterPath;
    }
}
