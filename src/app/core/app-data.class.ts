import { AppConfig } from './config/app.config';

export class AppData {

    public subTitle: string;

    public appName = AppConfig.AppName;
    public mainTitle = AppConfig.MainTitle;

    constructor(
        private options?: {
            subTitle?: string
        }
    ) {
        Object.assign(this, options);
    }
}