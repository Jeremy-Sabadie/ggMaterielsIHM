import { User } from "./User";

export interface Materiel {
  id?: number;
  name: string;
  endGarantee: string | Date;
  lastUpdate: string | Date;
  serviceDat: string | Date;
  proprietaire: User;
}
