export interface ICacheObject {}

export interface ICache {
  Read(key: string, defaultValue?: object): any;

  Has(key: string): boolean;

  Create(key: string, value: object, expiration?: number): void;

  Update(key: string, value: object, expiration?: number): void;

  Delete(key: string): void;

  ReadAll(): ICacheObject;

  DeleteAll(): void;

  GetExpiration(key: string): number | undefined;

  IsExpired(key: string): boolean;
}
