import { AppData } from '../app-data.class';

export interface IComponent {

    initAppData(): AppData

    redirectToErrorPage(): void;

    resolveFullScreenLoader(): void;

    registerFullScreenLoader(): void;

    showSnackbar(message: string): void;

    showSavedSnackbar(): void;
}