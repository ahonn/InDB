import InDB, { Store, Column, Index, MultiIndex, ObjectStore } from '../src/index';

@ObjectStore({ name: 'todo' })
class TodoStore extends Store {
  @Column({ name: '_t' })
  @Index({ name: 'index_t' })
  title: string;

  @Column()
  @MultiIndex()
  description: string;

  @Column()
  @Index({ name: '_c' })
  comment: string;

  @Column()
  comment2: string;

  upgrade(transaction, oldVersion, newVersion) {
    console.log('upgrade: ' + oldVersion + ' to ' + newVersion);
  }
}

window.db = new InDB('example-database', 2, [new TodoStore()]);
window.db.open();
console.log(window.db);
