import * as assert from "assert";
import { suite, test, beforeEach } from "mocha";
import Cache, { CacheObject } from "../../../src/cache/Cache";

suite("Cache", () => {
  let cache: Cache;
  let mockContext: any;
  let cacheObject: CacheObject;

  beforeEach(() => {
    cacheObject = new CacheObject();
    cacheObject["key1"] = { value: "value1" };
    cacheObject["key2"] = { value: "value2" };
    cacheObject["expiredKey"] = {
      value: "expiredValue",
      expiration: Math.floor(Date.now() / 1000 - 1000), // 1 second ago
    };
    cacheObject["notExpiredKey"] = {
      value: "notExpiredValue",
      expiration: Math.floor(Date.now() / 1000 + 1000 * 60 * 60), // 1 hour from now
    };

    mockContext = {
      globalState: {
        get: () => {
          return cacheObject;
        },
        update: () => {},
      },
    };
    cache = new Cache(mockContext);
  });

  test("should store and retrieve a value", () => {
    // Arrange & Act.
    const result = cache.Read("key1");

    // Assert.
    assert.equal(result, "value1");
  });

  test("should return undefined for non-existent key", () => {
    // Arrange & Act.
    const result = cache.Read("nonExistentKey");

    // Assert.
    assert.equal(result, undefined);
  });

  test("should return undefined for expired key", () => {
    // Arrange & Act.
    const result = cache.Read("expiredKey");

    // Assert.
    assert.equal(result, undefined);
  });

  test("should return default value for non-existent key", () => {
    // Arrange & Act.
    const result = cache.Read("nonExistentKey", "defaultValue");

    // Assert.
    assert.equal(result, "defaultValue");
  });

  test("should return default value for expired key", () => {
    // Arrange & Act.
    const result = cache.Read("expiredKey", "defaultValue");

    // Assert.
    assert.equal(result, "defaultValue");
  });

  test("should delete a value", () => {
    // Arrange & Act.
    cache.Delete("key1");
    const result = cache.Read("key1");

    // Assert.
    assert.equal(result, undefined);
  });

  test("should clear all values", () => {
    // Arrange & Act.
    cache.DeleteAll();

    // Assert.
    assert.equal(cache.Read("key1"), undefined);
    assert.equal(cache.Read("key2"), undefined);
  });

  test("should return true if key exists", () => {
    // Arrange & Act.
    const result = cache.Has("key1");

    // Assert.
    assert.equal(result, true);
  });

  test("should return false if key does not exist", () => {
    // Arrange & Act.
    const result = cache.Has("nonExistentKey");

    // Assert.
    assert.equal(result, false);
  });

  test("should update a value", () => {
    // Arrange & Act.
    cache.Update("key1", "newValue");
    const result = cache.Read("key1");

    // Assert.
    assert.equal(result, "newValue");
  });

  test("should return true if key is expired", () => {
    // Arrange & Act.
    const result = cache.IsExpired("expiredKey");

    // Assert.
    assert.equal(result, true);
  });

  test("should return false if key is not expired", () => {
    // Arrange & Act.
    const result = cache.IsExpired("notExpiredKey");

    // Assert.
    assert.equal(result, false);
  });

  test("should return the correct expiration time for a key", () => {
    // Arrange & Act.
    const result = cache.GetExpiration("notExpiredKey");

    // Assert.
    assert.equal(result, cacheObject["notExpiredKey"].expiration);
  });

  test("should return undefined for a key without expiration", () => {
    // Arrange & Act.
    const result = cache.GetExpiration("key1");

    // Assert.
    assert.equal(result, undefined);
  });

  test("should return undefined for a non-existent key", () => {
    // Arrange & Act.
    const result = cache.GetExpiration("nonExistentKey");

    // Assert.
    assert.equal(result, undefined);
  });

  test("should return all values, except expired keys", () => {
    // Arrange & Act.
    const result = cache.ReadAll();

    // Assert.
    assert.deepEqual(result, {
      key1: "value1",
      key2: "value2",
      notExpiredKey: "notExpiredValue",
    });
  });

  test("should create a new value", () => {
    // Arrange.
    const key = "newKey";
    const value = "newValue";

    // Act.
    cache.Create(key, value);
    const result = cache.Read(key);

    // Assert.
    assert.equal(result, value);
  });

  test("should overwrite an existing value when creating", () => {
    // Arrange.
    const key = "key1";
    const value = "newValue";

    // Act.
    cache.Create(key, value);
    const result = cache.Read(key);

    // Assert.
    assert.equal(result, "newValue");
  });

  test("should create a value with expiration", () => {
    // Arrange.
    const key = "expiringKey";
    const value = "expiringValue";
    const expiration = 60; // 1 minute from now

    // Act.
    cache.Create(key, value, expiration);
    const result = cache.Read(key);
    const isExpired = cache.IsExpired(key);

    // Assert.
    assert.equal(result, value);
    assert.equal(isExpired, false);
  });
});
