import { Azdo } from "../azdo/azdo";

export interface ICredentialStore {
  Initialize(): Promise<void>;
  IsAuthenticated(): boolean;
  GetHub(): Azdo | undefined;
  Login(): Promise<Azdo | undefined>;
}
