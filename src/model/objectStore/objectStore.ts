import 'reflect-metadata';

const OBJECT_STORE_NAME = Symbol.for('InDB:objectStoreName');
const OBJECT_STORE_OPTIONS = Symbol.for('InDB:objectStoreOptions');

export interface ObjectStoreOptions {
  name: string;
  keyPath?: string | string[];
  autoIncrement?: boolean;
}

export function getObjectStoreName(target: unknown) {
  return Reflect.getMetadata(OBJECT_STORE_NAME, target);
}

export function setObjectStoreName(target: unknown, name: string) {
  Reflect.defineMetadata(OBJECT_STORE_NAME, name, target);
}

export function getObjectStoreOptions(target: unknown) {
  return Reflect.getMetadata(OBJECT_STORE_OPTIONS, target);
}

export function setObjectStoreOptions(
  target: unknown,
  options: Omit<ObjectStoreOptions, 'name'>,
) {
  Reflect.defineMetadata(OBJECT_STORE_OPTIONS, options, target);
}

export function ObjectStore(options: ObjectStoreOptions) {
  return (target: unknown) => {
    const { name, keyPath, autoIncrement = true } = options;
    setObjectStoreName(target, name);
    setObjectStoreOptions(target, { keyPath, autoIncrement });
  };
}
