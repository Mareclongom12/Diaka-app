export interface Book {
  id: string;
  titre: string;
  auteur: string;
  description: string;
  langue: string;
  url: string;
}

export interface Biographie {
  id: string;
  nom: string;
  titre: string;
  periode: string;
  resume: string;
  fondateur_de?: string;
}

export const BOOKS_DATA: Book[] = [
  {
    id: 'livre-1',
    titre: 'Exemple : Traité de jurisprudence',
    auteur: 'Auteur à renseigner',
    description: 'Description courte du contenu de ce livre.',
    langue: 'Arabe',
    url: '',
  },
  {
    id: 'livre-2',
    titre: 'Exemple : Recueil de invocations quotidiennes',
    auteur: 'Auteur à renseigner',
    description: 'Description courte du contenu de ce livre.',
    langue: 'Français',
    url: '',
  },
];

export const BIOGRAPHIES_DATA: Biographie[] = [
  {
    id: 'bamba',
    nom: 'Cheikh Ahmadou Bamba Mbacké',
    titre: 'Fondateur du mouridisme',
    periode: '1853 – 1927',
    resume: "Fondateur de la confrérie mouride (Mouridiyya) au Sénégal, connu pour son enseignement centré sur le travail, la prière et la non-violence face à la colonisation française. Il est l'auteur de nombreux poèmes et écrits religieux en arabe.",
    fondateur_de: 'Confrérie Mouride',
  },
  {
    id: 'malick-sy',
    nom: 'El Hadji Malick Sy',
    titre: 'Grand savant et guide spirituel tidiane',
    periode: '1855 – 1922',
    resume: "Éminent érudit sénégalais, il a largement contribué à la diffusion de la confrérie tidiane (Tijaniyya) au Sénégal, en fondant notamment des centres d'enseignement religieux à Tivaouane, devenue un important foyer de savoir islamique.",
    fondateur_de: 'Foyer religieux de Tivaouane',
  },
  {
    id: 'baye-niass',
    nom: 'Cheikh Al-Islam Ibrahima Niasse (Baye Niass)',
    titre: 'Guide spirituel tidiane',
    periode: '1900 – 1975',
    resume: "Figure majeure de la confrérie tidiane au XXe siècle, originaire de Kaolack, connu pour avoir largement diffusé un enseignement spirituel (la 'Faydha') qui a rayonné bien au-delà du Sénégal, notamment en Afrique de l'Ouest et au-delà.",
    fondateur_de: 'Faydha Tidianiyya',
  },
];
