import { AppData } from '../app-data.class';

export interface IComponent {

    initAppData(): AppData

    redirectToErrorPage(): void;

    resolveLoader(): void;

    registerLoader(): void;

    showSnackbar(message: string): void;

    showSavedSnackbar(): void;
}