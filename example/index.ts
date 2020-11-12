import InDB, { Column, ObjectStore, getAttributes } from '../src/index';

@ObjectStore({ name: 'todo' })
class Todo {
  @Column({ index: true }) title: string;
  @Column() description: string;
}

const todo = new Todo();
console.log(todo);
console.log(getAttributes(todo));

const db = new InDB('todos');
console.log(db);
