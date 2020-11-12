import 'reflect-metadata';

const ATTRIBUTES_KEY = Symbol.for('InDB:columnAttributes');

export interface Attribute {
  name: string;
  index: boolean;
  indexName: string;
  unique: boolean;
}

export function getAttributes(target: unknown): { [name: string]: Attribute } {
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
  attributes: { [key: string]: Attribute },
): void {
  Reflect.defineMetadata(ATTRIBUTES_KEY, { ...attributes }, target);
}

export function addAttribute(
  target: unknown,
  name: string,
  attribute: Partial<Attribute>,
) {
  const attributes = getAttributes(target);
  attributes[name] = {
    ...attributes[name],
    ...attribute,
  };
  setAttributes(target, attributes);
}

