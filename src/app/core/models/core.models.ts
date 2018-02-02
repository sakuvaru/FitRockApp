import { Observable } from 'rxjs/Rx';
import { LanguageEnum } from '../../../lib/repository';
import { guidHelper } from 'lib/utilities';

export class ResourceKey {

    public key: string;
    public data?: any;

    constructor(
        options: {
            key: string,
            data?: any
        }
    ) {
        Object.assign(this, options);
    }
}

export class MenuItem {
    public icon?: string;
    public nestedItems?: MenuItemNested[];

    public identifier: string = guidHelper.newGuid();

    constructor(
        public label: ResourceKey,
        public type: MenuItemType,
        public action: string,
        options?: {
            icon?: string,
            nestedItems?: MenuItemNested[],
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    }
}

export class MenuItemNested {
    constructor(
        public label: ResourceKey,
        public type: MenuItemType,
        public action: string,
        options?: {
            nestedItems?: MenuItemNested[]
        }
    ) {
        if (options) {
            Object.assign(this, options);
        }
    } 
}

export enum MenuItemType {
    withNestedItems,
    auth,
    trainer,
    client
}

export class AuthenticatedUser {
    constructor(
        public id: number,
        public email: string,
        public firstName: string,
        public lastName: string,
        public trainerId: number,
        public isClient: boolean,
        public avatarUrl: string,
        public language: LanguageEnum,
        public gravatarUrl: string,
        public license: string
    ) { }

    /**
    * Gets either avatar or gravatar url.
    * Avatar has priority
    */
    getAvatarOrGravatarUrl(): string {
        if (this.avatarUrl) {
            return this.avatarUrl;
        }

        return this.gravatarUrl;
    }
}

export class LanguageConfig {
    constructor(
        /**
         * Language source enum
         */
        public language: LanguageEnum,

        /**
         * Locale
         */
        public locale: string,

        /**
         * Translation used for ngx translate service
         * This points to language json in assets
         */
        public uiLanguage: string
    ) {
    }
}

export class ComponentAction {
    constructor(
        public icon: () => string,
        public action: () => void,
        public tooltip?: () => Observable<string>
    ) { }
}

export class NavigateResult {
    constructor(
        private navigateMethod: (string) => void,
        private url: string
    ) { }

    navigate(): void {
        this.navigateMethod(this.url);
    }

    getUrl(): string {
        return this.url;
    }   
}


