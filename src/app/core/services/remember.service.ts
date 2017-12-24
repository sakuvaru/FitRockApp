import { Injectable } from '@angular/core';
import { booleanHelper, dateHelper, numberHelper, stringHelper } from 'lib/utilities';

type ItemValue = string | number | boolean | Date;

@Injectable()
/**
 * This service is used to remember settings/objects and to easily get/set those settings.
 * i.e. user's preferred configuration of data table mode can be stored here...
 */
export class RememberService {

  /**
   * This is just to indicate where the items are stored
   */
  private readonly mode = 'localStorage';

  /**
   * Sets given item.
   * @param key Key under which item will be stored
   * @param value Value to store
   */
  set<T extends string | number | boolean | Date>(key: string, value: T): void {
    this.saveToStorage(key, value);
  }

  get<T extends string | number | boolean | Date>(key: string, defaultValue: T): T {
    const item = this.getFromStorage(key);

    if (!item) {
      return defaultValue;
    } else {
      return item as T;
    }
  }

  private saveToStorage<T extends string | number | boolean | Date>(key: string, value: T): void {
    let valueToStore: string | number | boolean | Date;
    let type: ItemType;

    if (stringHelper.isString(value)) {
      valueToStore = value.toString();
      type = ItemType.String;
    } else if (numberHelper.isNumber(value)) {
      valueToStore = value.toString();
      type = ItemType.Number;
    } else if (dateHelper.isDate(value)) {
      valueToStore = value.toString();
      type = ItemType.Date;
    } else if (booleanHelper.isBoolean(value)) {
      if (value) {
        valueToStore = 'true';
      } else {
        valueToStore = 'false';
      }
      type = ItemType.Boolean;
    } else {
      throw Error(`Unsupported type of store. Only simple types are supported: string, number, Date, boolean`);
    }

    const objectToStore: RememberedItem = new RememberedItem(type, valueToStore, this.mode);

    // store item in local storage as Json
    localStorage.setItem(key, JSON.stringify(objectToStore));
  }

  private getFromStorage<T extends string | number | boolean | Date>(key: string): T | undefined {
    // get item from local storage
    const rememberedJson = localStorage.getItem(key);

    if (!rememberedJson) {
      return undefined;
    }

    // get remembered item
    const rememberedItem = JSON.parse(rememberedJson) as RememberedItem;

    let value: string | number | boolean | Date | undefined;

    if (+rememberedItem.type === ItemType.String) {
      value = rememberedItem.value.toString();
    } else if (+rememberedItem.type === ItemType.Number) {
      value = +rememberedItem.value;
    } else if (+rememberedItem.type === ItemType.Boolean) {
      if (rememberedItem.value === 'true') {
        value = true;
      } else {
        value = false;
      }
    } else if (+rememberedItem.type === ItemType.Date) {
      value = new Date(rememberedItem.value.toString());
    } else {
      throw Error(`Unexpected remembered item type of '${rememberedItem.type}'`);
    }

    return value as T;
  }
}

class RememberedItem {
  constructor(
    public type: ItemType,
    public value: string | number | boolean | Date,
    public mode: string
  ) { }
}

enum ItemType {
  String = 0,
  Number = 1,
  Date = 2,
  Boolean = 3,
}

