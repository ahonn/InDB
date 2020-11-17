export abstract class Store {
  abstract upgrade(transaction: IDBTransaction, oldVersion: number, newVersion: number);
}
