import { ExtensionContext } from "vscode";
import { ICache, ICacheObject } from "../interfaces/ICache";

export class CacheObject implements ICacheObject {
  [key: string]: { value: any; expiration?: number };
}

export default class Cache implements ICache {
  private _namespace: string;
  private _cache: CacheObject = {};

  constructor(private readonly _context: ExtensionContext, namespace?: string) {
    this._namespace = namespace || "default";
    this._cache = this._context.globalState.get(this._namespace, {});
  }

  Read(key: string, defaultValue?: object) {
    // If doesn't exist
    if (typeof this._cache[key] === "undefined") {
      // Return default value
      if (typeof defaultValue !== "undefined") {
        return defaultValue;
      } else {
        return undefined;
      }
    } else {
      // Is item expired?
      if (this.IsExpired(key)) {
        return undefined;
      }
      // Otherwise return the value
      return this._cache[key].value;
    }
  }

  Has(key: string) {
    if (typeof this._cache[key] === "undefined") {
      return false;
    } else {
      return this.IsExpired(key) ? false : true;
    }
  }

  Create(key: string, value: object, expiration?: number) {
    let obj = { value: value, expiration: expiration };

    // Save to local cache object
    this._cache[key] = obj;

    // Save to extension's globalState
    return this._context.globalState.update(this._namespace, this._cache);
  }

  Update(key: string, value: object, expiration?: number) {
    return this.Create(key, value, expiration);
  }

  Delete(key: string) {
    // Does item exist?
    if (typeof this._cache[key] === "undefined") {
      return new Promise(function (resolve, reject) {
        resolve(true);
      });
    }

    // Delete from local object
    delete this._cache[key];

    // Update the extension's globalState
    return this._context.globalState.update(this._namespace, this._cache);
  }

  ReadAll() {
    let items: { [key: string]: any } = {};
    for (let key in this._cache) {
      items[key] = this._cache[key].value;
    }
    return items;
  }

  DeleteAll() {
    this._cache = {};
    return this._context.globalState.update(this._namespace, undefined);
  }

  GetExpiration(key: string) {
    if (
      typeof this._cache[key] === "undefined" ||
      typeof this._cache[key].expiration === "undefined"
    ) {
      return undefined;
    } else {
      return this._cache[key].expiration;
    }
  }

  IsExpired(key: string) {
    // If key doesn't exist or it has no expiration
    if (
      typeof this._cache[key] === "undefined" ||
      typeof this._cache[key].expiration === "undefined"
    ) {
      return false;
    } else {
      // Is expiration >= right now?
      return this.now() >= this._cache[key].expiration;
    }
  }

  private now() {
    return Math.floor(Date.now() / 1000);
  }
}
