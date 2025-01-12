import * as assert from "assert";
import { suite, test, beforeEach } from "mocha";
import Cache from "../../../src/cache/Cache";

suite("Cache", () => {
  let cache: Cache;

  beforeEach(() => {
    const mockContext = {
      globalState: { get: () => ({}), update: () => {} },
    } as any;
    cache = new Cache(mockContext);
  });

  test("should store and retrieve a value", () => {
    cache.Create("key", "value");
    const result = cache.Read("key");
    assert.equal(result, "value");
  });

  test("should return undefined for non-existent key", () => {
    const result = cache.Read("nonExistentKey");
    assert.equal(result, undefined);
  });

  test("should delete a value", () => {
    cache.Create("key", "value");
    cache.Delete("key");
    const result = cache.Read("key");
    assert.equal(result, undefined);
  });

  test("should clear all values", () => {
    cache.Create("key1", "value1");
    cache.Create("key2", "value2");
    cache.DeleteAll();
    assert.equal(cache.Read("key1"), undefined);
    assert.equal(cache.Read("key2"), undefined);
  });

  test("should return true if key exists", () => {
    cache.Create("key", "value");
    const result = cache.Has("key");
    assert.equal(result, true);
  });

  test("should return false if key does not exist", () => {
    const result = cache.Has("nonExistentKey");
    assert.equal(result, false);
  });
});
