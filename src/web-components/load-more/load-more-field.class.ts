import { IItem } from '../../lib/repository';

export class LoadMoreField<TItem extends IItem>{

    public resolver?: (item: TItem) => string;
    public translate?: (item: TItem) => boolean;
    public translationData?: (item: TItem) => any;
    public htmlResolver?: (item: TItem) => string;

    constructor(options: {
        resolver?: (item: TItem) => string,
        translate?: (item: TItem) => boolean,
        translationData?: (item: TItem) => any,
        htmlResolver?: (item: TItem) => string;
    }) {
        Object.assign(this, options);
    }
}
