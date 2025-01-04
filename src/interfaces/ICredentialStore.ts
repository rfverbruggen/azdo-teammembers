import { IAzDOHub } from "../interfaces/IAzDOHub";

export interface ICredentialStore {
  Initialize(): Promise<void>;
  IsAuthenticated(): boolean;
  GetHub(): IAzDOHub | undefined;
  Login(): Promise<IAzDOHub | undefined>;
}
