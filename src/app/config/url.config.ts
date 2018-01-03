
export class UrlConfig {

    public static EntryPath = 'entry';

    public static TrainerMasterPath = 'trainer';
    public static ClientMasterPath = 'client';
    public static AuthMasterPath = 'auth';
    public static SharedMasterPath = 'shared';

    public static Login = 'login';
    public static ResetPassword = 'reset-password';
    public static Register = 'register';
    public static AppError = 'error';
    public static Unauthorized = 'unauthorized';
    public static Logout = 'logout';
    public static Item404 = '404';
    public static Global404 = '404';
    public static ServerDown = 'server-down';
    public static Redirect = 'redirect';
    public static RedirectAfterLogout = UrlConfig.Login;
    public static ProcessExternalLogin = UrlConfig.AuthMasterPath + '/' + 'process-login';
    public static Default = 'login';

    public static AppErrorLogGuidQueryString = 'q';

    public static getUnAuthorizedUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Unauthorized);
    }

    public static getGlobal404(): string {
        return '/' + UrlConfig.Global404;
    }

    public static getServerDown(): string {
        return '/' + UrlConfig.ServerDown;
    }

    public static getEntryUrl(): string {
        return '/' + UrlConfig.EntryPath;
    }

    public static getLoginUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Login);
    }

    public static getResetPasswordUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.ResetPassword);
    }

    public static getLogoutUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Logout);
    }

    public static getItem404(): string {
        return UrlConfig.getAppUrl(UrlConfig.SharedMasterPath + '/' + UrlConfig.Item404);
    }

    public static getAppErrorUrl(): string {
        return UrlConfig.getAppUrl(UrlConfig.SharedMasterPath + '/' + UrlConfig.AppError);
    }

    public static getAppUrl(action: string): string {
        return action;
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
