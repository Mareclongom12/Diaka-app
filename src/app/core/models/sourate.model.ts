export interface Sourate {
  id: number;
  numero: number;
  nom_arabe: string;
  nom_francais: string;
  nombre_versets: number;
  revelation: 'Mecquoise' | 'Medinoise';
}
