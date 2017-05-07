import { AppData } from '../app-data.class';

export interface IComponent {
    ngOnInit(): void;
    registerLoader(): void;

    // implement to register shared app data
    initAppData(): AppData
    }