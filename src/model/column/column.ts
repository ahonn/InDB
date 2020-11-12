import { addAttribute, Attribute } from './attributes';

export type ColumnAttribute = Pick<Attribute, 'name'>;

export function Column(options: Partial<ColumnAttribute> = {}): PropertyDecorator {
  return (target: unknown, propertyName: string) => {
    const attribute: ColumnAttribute = {
      name: options.name || propertyName,
    };

    addAttribute(target, propertyName, attribute);
  };
}
