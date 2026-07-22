import { Reciter } from './reciter.model';

export interface Audio {
  id: number;
  sourate_id: number;
  reciter_id: number;
  url: string;
  duree?: number | null;
  reciter?: Reciter;
}
