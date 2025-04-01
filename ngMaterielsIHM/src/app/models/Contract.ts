import { Entreprise } from "./Entrprise";

export interface Contract {
  id?: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  type: string;
  entreprise: Entreprise;
}
