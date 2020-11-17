import EventEmitter from 'events';

import {
  getObjectStoreName,
  getObjectStoreOptions,
} from './model/objectStore/objectStore';
import { getAttributes } from './model/column/attributes';
import type { Store } from './model/store';

export interface InDBOptions {
  indexedDB?: IDBFactory;
}

class InDB {
  private dbName: string;
  private stores: Store[];
  private options: Partial<InDBOptions>;

  private event = new EventEmitter();

  public version: number;
  public database: IDBDatabase;

  static defaultOptions: InDBOptions = {
    indexedDB:
      globalThis.indexedDB ||
      globalThis.mozIndexedDB ||
      globalThis.webkitIndexedDB ||
      globalThis.msIndexedDB,
  };

  static configure(options: InDBOptions) {
    InDB.defaultOptions = {
      ...InDB.defaultOptions,
      ...options,
    };
  }

  constructor(
    dbName: string,
    version: number,
    models: Store[],
    options?: InDBOptions,
  ) {
    this.dbName = dbName;
    this.version = version;
    this.stores = models;
    this.options = { ...options, ...InDB.defaultOptions };
  }

  private createObjectStore(transaction: IDBTransaction, model: Store) {
    const name = getObjectStoreName(model.constructor);
    const attributes = getAttributes(model);
    const options = getObjectStoreOptions(model.constructor);

    const objectStore = transaction.db.createObjectStore(name, options);
    const attributesName = Object.keys(attributes);
    for (const attributeName of attributesName) {
      const { index, indexName, unique } = attributes[attributeName];
      if (index) {
        objectStore.createIndex(indexName, attributeName, { unique });
      }
    }
  }

  private updateIndex(transaction: IDBTransaction, model: Store) {
    const name = getObjectStoreName(model.constructor);
    const attributes = getAttributes(model);
    const objectStore = transaction.objectStore(name);

    const attributesName = Object.keys(attributes);
    for (const attributeName of attributesName) {
      const { index, indexName, unique } = attributes[attributeName];
      if (index && !objectStore.indexNames.contains(indexName)) {
        objectStore.createIndex(indexName, attributeName, { unique });
      }
    }
  }

  public open() {
    const { indexedDB } = this.options;
    const req =
      this.version > 1
        ? indexedDB.open(this.dbName, this.version)
        : indexedDB.open(this.dbName);

    req.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
      const transaction = req.transaction;

      if (ev.oldVersion === 0) {
        for (const store of this.stores) {
          this.createObjectStore(transaction, store);
        }
      } else {
        for (const store of this.stores) {
          store.upgrade(transaction, ev.oldVersion, ev.newVersion);
          this.updateIndex(transaction, store);
        }
      }
    };
  }
}

export default InDB;
