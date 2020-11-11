import EventEmitter from 'events';

export interface InDBOptions {
  indexedDB?: IDBFactory;
}

const defaultOptions: InDBOptions = {
  indexedDB:
    globalThis.indexedDB ||
    globalThis.mozIndexedDB ||
    globalThis.webkitIndexedDB ||
    globalThis.msIndexedDB,
};

class InDB {
  private options: InDBOptions;

  private event = new EventEmitter();

  constructor(private name: string, options?: InDBOptions) {
    this.options = { ...options, ...defaultOptions };
  }
}

export default InDB;
