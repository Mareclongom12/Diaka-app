import { Injectable } from '@angular/core';

export interface WuduStep {
  id: number;
  title: string;
  description: string;
  repetitions: number | null;
  icon: 'niyyah' | 'hands' | 'mouth' | 'nose' | 'face' | 'arms' | 'head' | 'ears' | 'feet' | 'dua';
}

@Injectable({ providedIn: 'root' })
export class WuduService {
  steps: WuduStep[] = [
    {
      id: 1,
      title: "L'intention (Niyyah)",
      description: "Forme dans ton cœur l'intention de faire les ablutions pour la prière. L'intention ne se prononce pas obligatoirement à voix haute, elle est dans le cœur.",
      repetitions: null,
      icon: 'niyyah',
    },
    {
      id: 2,
      title: 'Dire Bismillah',
      description: '« Bismillah » (Au nom d\'Allah) avant de commencer.',
      repetitions: null,
      icon: 'niyyah',
    },
    {
      id: 3,
      title: 'Laver les mains',
      description: "Laver les deux mains jusqu'aux poignets, en commençant par la main droite, en veillant à bien nettoyer entre les doigts.",
      repetitions: 3,
      icon: 'hands',
    },
    {
      id: 4,
      title: 'Rincer la bouche',
      description: "Prendre de l'eau dans la bouche, la faire tourner puis la recracher.",
      repetitions: 3,
      icon: 'mouth',
    },
    {
      id: 5,
      title: 'Nettoyer le nez',
      description: "Aspirer de l'eau dans les narines puis la faire ressortir en soufflant (sans avaler).",
      repetitions: 3,
      icon: 'nose',
    },
    {
      id: 6,
      title: 'Laver le visage',
      description: "Du haut du front jusqu'au bas du menton, et d'une oreille à l'autre.",
      repetitions: 3,
      icon: 'face',
    },
    {
      id: 7,
      title: "Laver les bras jusqu'aux coudes",
      description: "Commencer par le bras droit, puis le bras gauche, jusqu'aux coudes inclus.",
      repetitions: 3,
      icon: 'arms',
    },
    {
      id: 8,
      title: 'Essuyer la tête (Mash)',
      description: "Passer les mains mouillées de l'avant vers l'arrière de la tête, puis revenir à l'avant.",
      repetitions: 1,
      icon: 'head',
    },
    {
      id: 9,
      title: 'Essuyer les oreilles',
      description: "Avec les index à l'intérieur et les pouces derrière, en un seul geste après avoir essuyé la tête.",
      repetitions: 1,
      icon: 'ears',
    },
    {
      id: 10,
      title: "Laver les pieds jusqu'aux chevilles",
      description: "Commencer par le pied droit, puis le pied gauche, jusqu'aux chevilles incluses, en nettoyant entre les orteils.",
      repetitions: 3,
      icon: 'feet',
    },
    {
      id: 11,
      title: 'Invocation finale',
      description: 'Après les ablutions, il est recommandé de réciter la Chahada et une invocation dédiée.',
      repetitions: null,
      icon: 'dua',
    },
  ];

  duaFinale = {
    arabe: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translitteration: "Achhadou an la ilaha illa Allah wahdahou la charika lah, wa achhadou anna Mouhammadan 'abdouhou wa rassoulouh",
    traduction: "J'atteste qu'il n'y a de divinité qu'Allah, Seul et sans associé, et j'atteste que Muhammad est Son serviteur et Son messager.",
  };
}
