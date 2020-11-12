import InDB, { Model, Column, Index, MultiIndex, ObjectStore } from '../src/index';

@ObjectStore({ name: 'todo' })
class TodoModel extends Model {
  @Column({ name: '_t' })
  @Index({ name: 'index_t' })
  title: string;

  @Column()
  @MultiIndex()
  description: string;

  @Column()
  comment: string;

  @Column()
  comment2: string;
}

const db = new InDB('example-database', [new TodoModel()]);
db.open();
console.log(db);
