import Optional from 'optional-js';

export class ArrayUtils {
  static removeById<T extends HasId>(array: T[], id: string) {
    this.removeByPredicate(array, v => v.id === id);
  }

  static removeByPredicate<T>(array: T[], predicate: (e: T) => boolean) {
    const tmp = array.find(v => predicate(v));
    if (tmp) {
      const index = array.indexOf(tmp);
      array.splice(index, 1);
    }
  }

  static replaceById<T extends HasId>(array: T[], value: T) {
    this.putByIdHelper(array, value, false);
  }

  static putById<T extends HasId>(array: T[], value: T) {
    this.putByIdHelper(array, value, true);
  }

  static putByPredicate<T>(array: T[], value: T, predicate: (e: T) => boolean) {
    const index = array.findIndex(v => predicate(v));
    if (index < 0) {
      array.push(value);
    } else {
      array[index] = value;
    }
  }

  static getFirst<T>(array: T[]): Optional<T> {
    return array.length === 0
        ? Optional.empty()
        : Optional.of(array[0]);
  }

  private static putByIdHelper<T extends HasId>(array: T[], value: T, addIfAbsent: boolean) {
    const tmp = array.find(v => v.id === value.id);
    if (tmp) {
      const index = array.indexOf(tmp);
      array[index] = value;
    } else if (addIfAbsent) {
      array.push(value);
    }
  }

  static groupBy<T>(srcArray: T[], key: string, valueMapper: (v: T) => unknown) {
    function getPropertyValue(obj: any, property: string) {
      const value = property.split('.').reduce((o, propertyPart) => o[propertyPart], obj);
      return valueMapper ? valueMapper(value) : value;
    }

    return srcArray.reduce((acc: any, next: T) => {
      const value = getPropertyValue(next, key);
      acc[value] = acc[value] || [];
      acc[value].push(next);
      return acc;
    }, {});
  }
}

export interface HasId {
  id: string;
}
