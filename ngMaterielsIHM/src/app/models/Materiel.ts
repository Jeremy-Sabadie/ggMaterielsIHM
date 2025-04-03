import { User } from "./User";

export interface Materiel {
  id?: number;
  name: string;
  endGarantee: Date;
  lastUpdate: Date;
  serviceDat: Date;
  proprietaire: User;
}
