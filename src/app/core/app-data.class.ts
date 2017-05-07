import { AppConfig } from './config/app.config'; 

export class AppData {

    public appName = AppConfig.AppName;
    public mainTitle = AppConfig.MainTitle;

    constructor(
        public subTitle: string
    ) {
    }
}