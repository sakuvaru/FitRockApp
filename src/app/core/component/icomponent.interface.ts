import { AppData } from '../app-data/app-data.class';

export interface IComponent {

    appData: AppData;

    redirectToErrorPage(): void;

    resolveFullScreenLoader(): void;

    registerFullScreenLoader(): void;

    showSnackbar(message: string): void;

    showSavedSnackbar(): void;
}