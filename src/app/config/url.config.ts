
export class UrlConfig {

    static EntryPath = 'entry';

    static TrainerMasterPath = 'trainer';
    static ClientMasterPath = 'client';
    static AuthMasterPath = 'auth';
    static SharedMasterPath = 'shared';

    static Login = 'login';
    static ResetPassword = 'reset-password';
    static Register = 'register';
    static AppError = 'error';
    static Unauthorized = 'unauthorized';
    static Logout = 'logout';
    static Item404 = '404';
    static Global404 = '404';
    static ServerDown = 'server-down';
    static Redirect = 'redirect';
    static RedirectAfterLogout = UrlConfig.Login;
    static ProcessExternalLogin = UrlConfig.AuthMasterPath + '/' + 'process-login';
    static Default = 'login';

    static AppErrorLogGuidQueryString = 'q';

    static getUnauthorizedUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Unauthorized);
    }

    static getGlobal404Url(): string {
        return '/' + UrlConfig.Global404;
    }

    static getServerDownUrl(): string {
        return '/' + UrlConfig.ServerDown;
    }

    static getEntryUrl(): string {
        return '/' + UrlConfig.EntryPath;
    }

    static getLoginUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Login);
    }

    static getResetPasswordUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.ResetPassword);
    }

    static getLogoutUrl(): string {
        return UrlConfig.getAuthUrl(UrlConfig.Logout);
    }

    static getItem404Url(): string {
        return UrlConfig.getActionUrl(UrlConfig.SharedMasterPath + '/' + UrlConfig.Item404);
    }

    static getErrorUrl(): string {
        return UrlConfig.getActionUrl(UrlConfig.SharedMasterPath + '/' + UrlConfig.AppError);
    }

    static getActionUrl(action: string): string {
        return action;
    }

    static getTrainerUrl(action?: string): string {
        if (action) {
            return UrlConfig.TrainerMasterPath + '/' + action;
        }
        return UrlConfig.TrainerMasterPath;
    }

    static getClientUrl(action?: string): string {
        if (action) {
            return UrlConfig.ClientMasterPath + '/' + action;
        }
        return UrlConfig.ClientMasterPath;
    }

    static getAuthUrl(action?: string): string {
        if (action) {
            return UrlConfig.AuthMasterPath + '/' + action;
        }
        return UrlConfig.AuthMasterPath;
    }

    static getDietUrl(clientId: number, dietId: number): string {
        return UrlConfig.getTrainerUrl('clients//edit/' + clientId + '/diet/' + dietId + '/diet-plan');
    }

    static getWorkoutUrl(clientId: number, workoutId: number): string {
        return UrlConfig.getTrainerUrl('clients/edit/' + clientId + '/workout/' + workoutId + '/workout-plan');
    }

    static getAppointmentViewUrl(clientId: number, appointmentId: number): string {
        return UrlConfig.getTrainerUrl('clients/edit/' + clientId + '/appointments/view/' + appointmentId);
    }

    static getAppointmentEditUrl(clientId: number, appointmentId: number): string {
        return UrlConfig.getTrainerUrl('clients/edit/' + clientId + '/appointments/edit/' + appointmentId);
    }

    static getNewAppointmentUrl(clientId: number): string {
        return UrlConfig.getTrainerUrl('clients/edit/' + clientId + '/appointments/new');
    }

    static getChatMessageUrl(clientId: number): string {
        return UrlConfig.getTrainerUrl('clients/edit/' + clientId + '/chat');
    }
}
