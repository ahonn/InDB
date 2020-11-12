import EventEmitter from 'events';

import {
  getObjectStoreName,
  getObjectStoreOptions,
} from './model/objectStore/objectStore';
import { getAttributes } from './model/column/attributes';
import type { Model } from './model/model';

export interface InDBOptions {
  indexedDB?: IDBFactory;
}

class InDB {
  private dbName: string;
  private models: Model[];
  private options: Partial<InDBOptions>;
  private objectStores: Map<string, IDBObjectStore> = new Map();

  private event = new EventEmitter();

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

  constructor(dbName: string, models: Model[], options?: InDBOptions) {
    this.dbName = dbName;
    this.models = models;
    this.options = { ...options, ...InDB.defaultOptions };
  }

  private createObjectStore(transaction: IDBTransaction, model: Model) {
    const name = getObjectStoreName(model.constructor);
    const options = getObjectStoreOptions(model.constructor);
    const attributes = getAttributes(model);

    const objectStore = transaction.db.createObjectStore(name, options);
    this.objectStores.set(name, objectStore);

    const attributesName = Object.keys(attributes);
    for (const attributeName of attributesName) {
      const { index, indexName, unique } = attributes[attributeName];
      if (index) {
        objectStore.createIndex(indexName, attributeName, { unique });
      }
    }
  }

  public open() {
    const { indexedDB } = this.options;
    const req = indexedDB.open(this.dbName);
    req.onupgradeneeded = (ev: IDBVersionChangeEvent) => {
      if (ev.oldVersion === 0) {
        const transaction = req.transaction;
        for (const model of this.models) {
          this.createObjectStore(transaction, model);
        }
      } else {
        console.log('upgrade');
      }
    };
  }
}

export default InDB;
