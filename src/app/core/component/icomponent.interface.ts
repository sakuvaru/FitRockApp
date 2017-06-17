import { IComponentConfig, MenuItem, ResourceKey } from '../component/component.config';

export interface IComponent {

    setConfig(options?:
        {
            componentTitle?: ResourceKey,
            menuItems?: MenuItem[],
            appName?: string,
            menuTitle?: ResourceKey
        }
    ): void;

    updateMenuItems(menuItems: MenuItem[]): void;

    updateComponentTitle(title: ResourceKey): void;

    redirectToErrorPage(): void;

    resolveFullScreenLoader(): void;

    registerFullScreenLoader(): void;

    showSnackbar(message: string): void;

    showSavedSnackbar(): void;
}