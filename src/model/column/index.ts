import { addAttribute, Attribute } from './attributes';

export interface IndexAttributeOptions {
  name?: string;
  unique?: boolean;
}

export type IndexAttribute = Pick<Attribute, 'index' | 'indexName' | 'unique'>;

export function Index(options: IndexAttributeOptions = {}): PropertyDecorator {
  return (target: unknown, propertyName: string) => {
    const attribute: IndexAttribute = {
      index: true,
      indexName: options.name ?? propertyName,
      unique: options.unique ?? true,
    };

    addAttribute(target, propertyName, attribute);
  };
}

export function MultiIndex(
  options: IndexAttributeOptions = {},
): PropertyDecorator {
  return Index({ ...options, unique: false });
}
