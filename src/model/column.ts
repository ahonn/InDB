import 'reflect-metadata';

const ATTRIBUTES_KEY = Symbol.for('InDB:columnAttributes');

export interface ColumnAttribute {
  index?: boolean;
  get?: PropertyDescriptor['get'];
  set?: PropertyDescriptor['set'];
}

export function getAttributes(target: unknown) {
  const attributes = Reflect.getMetadata(ATTRIBUTES_KEY, target);
  if (attributes) {
    return Object.keys(attributes).reduce((copy, key) => {
      copy[key] = { ...attributes[key] };
      return copy;
    }, {});
  }
  return {};
}

export function setAttributes(
  target: unknown,
  attributes: { [key: string]: unknown },
): void {
  Reflect.defineMetadata(ATTRIBUTES_KEY, { ...attributes }, target);
}

export function addAttribute(
  target: unknown,
  name: string,
  options: ColumnAttribute,
) {
  const attributes = getAttributes(target);
  attributes[name] = { ...options };
  setAttributes(target, attributes);
}

export function Column(options: Partial<ColumnAttribute> = {}) {
  return (
    target: unknown,
    propertyName: string,
    propertyDescriptor?: PropertyDescriptor,
  ) => {
    const attribute: ColumnAttribute = { ...options };
    if (propertyDescriptor) {
      if (propertyDescriptor.get) {
        attribute.get = propertyDescriptor.get;
      }
      if (propertyDescriptor.set) {
        attribute.set = propertyDescriptor.set;
      }
    }

    addAttribute(target, propertyName, attribute);
  };
}
