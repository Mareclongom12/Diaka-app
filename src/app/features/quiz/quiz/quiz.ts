import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTION_POOL: QuizQuestion[] = [
  // Bases de l'islam
  { question: "Combien y a-t-il de piliers de l'islam ?", options: ['Trois', 'Cinq', 'Sept', 'Dix'], correctIndex: 1 },
  { question: "Quel est le premier pilier de l'islam ?", options: ['La prière', 'Le jeûne', 'La chahada', 'Le hajj'], correctIndex: 2 },
  { question: 'Que signifie le mot "islam" ?', options: ['Paix', 'Soumission', 'Foi', 'Unité'], correctIndex: 1 },
  { question: 'Comment appelle-t-on un adepte de l\'islam ?', options: ['Un musulman', 'Un croyant', 'Un fidèle', 'Un disciple'], correctIndex: 0 },
  { question: "Quel est le nom du dernier prophète en islam ?", options: ['Moïse', 'Jésus', 'Muhammad', 'Abraham'], correctIndex: 2 },
  { question: 'Dans quelle ville le prophète Muhammad (ﷺ) est-il né ?', options: ['Médine', 'La Mecque', 'Jérusalem', 'Damas'], correctIndex: 1 },
  { question: 'Comment appelle-t-on le lieu de culte des musulmans ?', options: ['Une église', 'Une synagogue', 'Une mosquée', 'Un temple'], correctIndex: 2 },
  { question: 'Quel est le nom de la profession de foi musulmane ?', options: ['La salat', 'La chahada', 'Le zakat', 'Le sawm'], correctIndex: 1 },
  { question: 'Quel est le cinquième pilier de l\'islam ?', options: ['La zakat', 'La prière', 'Le pèlerinage', 'Le jeûne'], correctIndex: 2 },
  { question: 'Comment appelle-t-on l\'aumône obligatoire en islam ?', options: ['Le sawm', 'Le zakat', 'Le hajj', 'La salat'], correctIndex: 1 },
  { question: 'Vers quelle direction les musulmans se tournent-ils pour prier ?', options: ['Médine', 'Jérusalem', 'La Mecque', 'Damas'], correctIndex: 2 },
  { question: 'Comment appelle-t-on la direction de la prière ?', options: ['Le mihrab', 'La qibla', 'Le minaret', 'Le minbar'], correctIndex: 1 },
  { question: 'Quel ange a révélé le Coran au prophète Muhammad (ﷺ) ?', options: ['Michael', 'Gabriel', 'Israfil', 'Azrael'], correctIndex: 1 },
  { question: "Dans quelle grotte le prophète Muhammad (ﷺ) a-t-il reçu la première révélation ?", options: ['Hira', 'Thawr', 'Uhud', 'Badr'], correctIndex: 0 },
  { question: 'Quel est le nom du voyage nocturne du prophète Muhammad (ﷺ) ?', options: ['Le hajj', 'Al-Isra wal-Miraj', 'La hijra', 'Le ramadan'], correctIndex: 1 },
  { question: 'Comment appelle-t-on l\'émigration du prophète de La Mecque à Médine ?', options: ['La hijra', 'Le hajj', 'La zakat', 'Le sawm'], correctIndex: 0 },
  { question: 'Quel calendrier utilise l\'islam ?', options: ['Solaire', 'Lunaire', 'Grégorien', 'Julien'], correctIndex: 1 },
  { question: 'Quel est le nom du livre sacré de l\'islam ?', options: ['La Torah', 'Le Coran', 'La Bible', 'Les Vedas'], correctIndex: 1 },
  { question: 'Combien y a-t-il de piliers de la foi (iman) en islam ?', options: ['Quatre', 'Cinq', 'Six', 'Sept'], correctIndex: 2 },
  { question: 'Qui est considéré comme le premier prophète en islam ?', options: ['Noé', 'Adam', 'Abraham', 'Moïse'], correctIndex: 1 },
  { question: 'Quel prophète est associé à la construction de la Kaaba ?', options: ['Moïse', 'Abraham', 'Jésus', 'Noé'], correctIndex: 1 },
  { question: 'Comment appelle-t-on les paroles et actes du prophète Muhammad (ﷺ) ?', options: ['Le fiqh', 'La sunna', 'La charia', 'Le tafsir'], correctIndex: 1 },
  { question: 'Comment appelle-t-on la loi islamique ?', options: ['La charia', 'La sunna', 'Le hadith', 'Le tawhid'], correctIndex: 0 },
  { question: 'Que signifie le mot "tawhid" ?', options: ['La prière', "L'unicité de Dieu", 'Le jeûne', 'La charité'], correctIndex: 1 },
  { question: 'Quel est le nom donné aux récits rapportant les paroles du prophète Muhammad (ﷺ) ?', options: ['Les sourates', 'Les hadiths', 'Les versets', 'Les piliers'], correctIndex: 1 },

  // Pratique quotidienne
  { question: 'Combien de prières quotidiennes obligatoires ?', options: ['Trois', 'Quatre', 'Cinq', 'Six'], correctIndex: 2 },
  { question: 'Comment appelle-t-on les ablutions rituelles ?', options: ['Le wudu', 'Le sawm', 'Le zakat', 'Le hajj'], correctIndex: 0 },
  { question: 'Quelle est la première prière de la journée ?', options: ['Dhuhr', 'Fajr', 'Asr', 'Maghrib'], correctIndex: 1 },
  { question: 'Quelle est la dernière prière de la journée ?', options: ['Maghrib', 'Isha', 'Asr', 'Dhuhr'], correctIndex: 1 },
  { question: 'À quel moment la prière du Maghrib est-elle accomplie ?', options: ["À l'aube", 'À midi', 'Au coucher du soleil', 'La nuit'], correctIndex: 2 },
  { question: 'Pendant quel mois les musulmans jeûnent-ils ?', options: ['Chaabane', 'Ramadan', 'Muharram', 'Rajab'], correctIndex: 1 },
  { question: 'Comment appelle-t-on le repas pris avant l\'aube pendant le Ramadan ?', options: ['Le iftar', 'Le suhur', 'Le tarawih', 'Le zakat'], correctIndex: 1 },
  { question: 'Comment appelle-t-on le repas de rupture du jeûne ?', options: ['Le suhur', 'Le iftar', 'Le tarawih', 'Le witr'], correctIndex: 1 },
  { question: 'Comment appelle-t-on les prières nocturnes spécifiques au Ramadan ?', options: ['Tarawih', 'Witr', 'Duha', 'Tahajjud'], correctIndex: 0 },
  { question: 'Quelle fête marque la fin du Ramadan ?', options: ['Aïd al-Adha', 'Aïd al-Fitr', 'Achoura', 'Mawlid'], correctIndex: 1 },
  { question: 'Quelle fête commémore le sacrifice d\'Abraham ?', options: ['Aïd al-Fitr', 'Aïd al-Adha', 'Achoura', 'Mawlid'], correctIndex: 1 },
  { question: 'Comment appelle-t-on le pèlerinage à La Mecque ?', options: ['Le sawm', 'La zakat', 'Le hajj', 'La salat'], correctIndex: 2 },
  { question: 'Combien de fois un musulman doit-il accomplir le hajj au minimum ?', options: ['Jamais', 'Une fois dans sa vie si possible', 'Chaque année', 'Cinq fois'], correctIndex: 1 },
  { question: 'Comment appelle-t-on le petit pèlerinage, réalisable en tout temps ?', options: ['Le hajj', 'La omra', 'Le tawaf', 'Le sa\'i'], correctIndex: 1 },
  { question: 'Comment appelle-t-on le fait de tourner autour de la Kaaba ?', options: ['Le sa\'i', 'Le tawaf', 'Le wuquf', 'Le ramy'], correctIndex: 1 },
  { question: 'Qui est dispensé du jeûne du Ramadan pour raison de santé ?', options: ['Personne', 'Les malades', 'Uniquement les enfants', 'Uniquement les femmes'], correctIndex: 1 },
  { question: 'Comment appelle-t-on l\'appel à la prière ?', options: ['Le khutba', 'L\'adhan', 'Le tafsir', 'Le dhikr'], correctIndex: 1 },
  { question: 'Qui prononce traditionnellement l\'appel à la prière ?', options: ['L\'imam', 'Le muezzin', 'Le calife', 'Le savant'], correctIndex: 1 },
  { question: 'Comment appelle-t-on celui qui dirige la prière collective ?', options: ['Le muezzin', 'L\'imam', 'Le calife', 'Le hafiz'], correctIndex: 1 },
  { question: 'Quel jour de la semaine la prière collective du vendredi a-t-elle lieu ?', options: ['Jeudi', 'Vendredi', 'Samedi', 'Dimanche'], correctIndex: 1 },
  { question: 'Comment appelle-t-on le sermon prononcé avant la prière du vendredi ?', options: ['Le dhikr', 'La khutba', 'Le tafsir', 'Le adhan'], correctIndex: 1 },
  { question: 'Comment appelle-t-on quelqu\'un qui a mémorisé le Coran en entier ?', options: ['Un imam', 'Un hafiz', 'Un mufti', 'Un cheikh'], correctIndex: 1 },
  { question: 'Quelle est l\'aumône volontaire, distincte du zakat obligatoire ?', options: ['La sadaqa', 'Le waqf', 'Le fidya', 'Le kaffara'], correctIndex: 0 },
  { question: 'Comment appelle-t-on l\'invocation ou le rappel de Dieu ?', options: ['Le dhikr', 'Le tafsir', 'Le fiqh', 'Le hadith'], correctIndex: 0 },
  { question: 'Combien de rakaats (unités) compte la prière du Fajr ?', options: ['Deux', 'Trois', 'Quatre', 'Cinq'], correctIndex: 0 },

  // Le Coran
  { question: 'Combien de sourates compte le Coran ?', options: ['100', '104', '114', '120'], correctIndex: 2 },
  { question: 'Quelle est la plus longue sourate du Coran ?', options: ['Al-Fatiha', 'Al-Baqara', 'Yasin', 'Al-Ikhlas'], correctIndex: 1 },
  { question: 'Quelle sourate est la plus courte du Coran ?', options: ['Al-Ikhlas', 'Al-Kawthar', 'An-Nasr', 'Al-Asr'], correctIndex: 1 },
  { question: 'Quelle est la première sourate du Coran ?', options: ['Al-Baqara', 'Al-Fatiha', 'Al-Ikhlas', 'Yasin'], correctIndex: 1 },
  { question: 'Quelle est la dernière sourate du Coran ?', options: ['Al-Falaq', 'An-Nas', 'Al-Ikhlas', 'Al-Kawthar'], correctIndex: 1 },
  { question: 'Combien de versets compte la sourate Al-Fatiha ?', options: ['Cinq', 'Sept', 'Neuf', 'Onze'], correctIndex: 1 },
  { question: 'Comment appelle-t-on un verset du Coran ?', options: ['Une sourate', 'Un ayah', 'Un juz', 'Un hizb'], correctIndex: 1 },
  { question: 'En combien de parties (juz) le Coran est-il traditionnellement divisé ?', options: ['20', '25', '30', '40'], correctIndex: 2 },
  { question: 'Dans quelle langue le Coran a-t-il été révélé ?', options: ['Le persan', 'L\'arabe', 'L\'araméen', 'L\'hébreu'], correctIndex: 1 },
  { question: 'Sur combien d\'années la révélation du Coran s\'est-elle étalée ?', options: ['10 ans', '15 ans', '23 ans', '30 ans'], correctIndex: 2 },
  { question: 'Comment appelle-t-on les sourates révélées avant l\'hégire ?', options: ['Médinoises', 'Mecquoises', 'Anciennes', 'Primaires'], correctIndex: 1 },
  { question: 'Comment appelle-t-on les sourates révélées après l\'hégire ?', options: ['Mecquoises', 'Médinoises', 'Tardives', 'Secondaires'], correctIndex: 1 },
  { question: 'Quelle sourate porte le nom d\'un animal, la vache ?', options: ['Al-An\'am', 'Al-Baqara', 'An-Naml', 'Al-Fil'], correctIndex: 1 },
  { question: 'Quelle sourate porte le nom de la famille de Marie ?', options: ['Maryam', 'Al-Imran', 'An-Nisa', 'Al-Ahzab'], correctIndex: 1 },
  { question: 'Quelle sourate est dédiée à Marie, mère de Jésus ?', options: ['Al-Fatiha', 'Maryam', 'Al-Kahf', 'Yasin'], correctIndex: 1 },
  { question: 'Quel prophète biblique donne son nom à la sourate 71 ?', options: ['Nuh (Noé)', 'Yunus (Jonas)', 'Hud', 'Salih'], correctIndex: 0 },
  { question: 'Quelle sourate raconte l\'histoire de Joseph (Yusuf) ?', options: ['Yusuf', 'Yunus', 'Hud', 'Ibrahim'], correctIndex: 0 },
  { question: 'Comment appelle-t-on la traduction/interprétation du Coran ?', options: ['Le hadith', 'Le tafsir', 'Le fiqh', 'La sunna'], correctIndex: 1 },
  { question: 'Quelle sourate est souvent appelée "le cœur du Coran" ?', options: ['Al-Fatiha', 'Yasin', 'Al-Baqara', 'Al-Ikhlas'], correctIndex: 1 },
  { question: 'Quelle sourate est dédiée à l\'unicité absolue de Dieu ?', options: ['Al-Fatiha', 'Al-Ikhlas', 'Al-Baqara', 'An-Nas'], correctIndex: 1 },
  { question: 'Combien de versets compte la sourate Al-Baqara ?', options: ['176', '200', '286', '300'], correctIndex: 2 },
  { question: 'Quelle nuit est considérée comme la nuit de la révélation du Coran ?', options: ['Laylat al-Qadr', 'Laylat al-Miraj', 'Laylat al-Baraa', 'Aïd al-Fitr'], correctIndex: 0 },
  { question: 'Pendant quelle période du Ramadan Laylat al-Qadr est-elle recherchée ?', options: ['Les 10 premiers jours', 'Les 10 derniers jours', 'Le milieu du mois', 'Le premier jour'], correctIndex: 1 },
  { question: 'Quelle sourate est récitée à chaque unité de prière ?', options: ['Al-Baqara', 'Al-Fatiha', 'Yasin', 'Al-Kahf'], correctIndex: 1 },
  { question: 'Quel prophète est mentionné le plus souvent dans le Coran ?', options: ['Muhammad', 'Moïse (Musa)', 'Jésus (Issa)', 'Abraham (Ibrahim)'], correctIndex: 1 },
  { question: 'Quelle sourate évoque la caverne et ses compagnons ?', options: ['Al-Kahf', 'Al-Fil', 'Al-Buruj', 'Al-Qamar'], correctIndex: 0 },
  { question: 'Quelle sourate est recommandée le vendredi selon la tradition ?', options: ['Al-Kahf', 'Al-Mulk', 'Ya-Sin', 'Al-Waqi\'a'], correctIndex: 0 },
  { question: 'Comment appelle-t-on la récitation mélodieuse du Coran ?', options: ['Le tajwid', 'Le tafsir', 'Le fiqh', 'Le hadith'], correctIndex: 0 },
  { question: 'Quelle sourate porte le nom d\'un insecte ?', options: ['An-Naml (la fourmi)', 'Al-Fil (l\'éléphant)', 'Al-Baqara (la vache)', 'An-Nahl (l\'abeille)'], correctIndex: 3 },
  { question: 'Quelle sourate évoque un éléphant ?', options: ['Al-Fil', 'An-Naml', 'An-Nahl', 'Al-Ankabut'], correctIndex: 0 },
  { question: 'Quelle sourate porte le nom d\'une araignée ?', options: ['An-Naml', 'Al-Ankabut', 'An-Nahl', 'Al-Fil'], correctIndex: 1 },
  { question: 'Quel calife a supervisé la compilation officielle du Coran en un seul livre ?', options: ['Abu Bakr', 'Umar', 'Uthman', 'Ali'], correctIndex: 2 },
  { question: 'Quel est le nom du premier verset révélé du Coran (premier mot) ?', options: ['Bismillah', 'Iqra (Lis)', 'Qul (Dis)', 'Alhamdulillah'], correctIndex: 1 },
  { question: 'Quelle formule ouvre la majorité des sourates du Coran ?', options: ['Alhamdulillah', 'Bismillah ar-Rahman ar-Rahim', 'Subhanallah', 'Allahu Akbar'], correctIndex: 1 },
];

@Component({
  selector: 'app-quiz',
  imports: [RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  private readonly QUESTIONS_PER_ROUND = 10;

  questions: QuizQuestion[] = this.pickRandomQuestions();

  currentIndex = signal(0);
  score = signal(0);
  selectedOption = signal<number | null>(null);
  showAnswer = signal(false);
  finished = signal(false);

  currentQuestion = computed(() => this.questions[this.currentIndex()]);
  progress = computed(() => (this.currentIndex() / this.questions.length) * 100);
  isCelebration = computed(() => this.score() >= 7);

  private shuffle<T>(list: T[]): T[] {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private pickRandomQuestions(): QuizQuestion[] {
    return this.shuffle(QUESTION_POOL).slice(0, this.QUESTIONS_PER_ROUND);
  }

  selectOption(index: number): void {
    if (this.showAnswer()) return;

    this.selectedOption.set(index);
    this.showAnswer.set(true);

    if (index === this.currentQuestion().correctIndex) {
      this.score.update(s => s + 1);
    }
  }

  nextQuestion(): void {
    if (this.currentIndex() + 1 >= this.questions.length) {
      this.finished.set(true);
      return;
    }
    this.currentIndex.update(i => i + 1);
    this.selectedOption.set(null);
    this.showAnswer.set(false);
  }

  restart(): void {
    this.questions = this.pickRandomQuestions();
    this.currentIndex.set(0);
    this.score.set(0);
    this.selectedOption.set(null);
    this.showAnswer.set(false);
    this.finished.set(false);
  }

  resultMessage(): string {
    const ratio = this.score() / this.questions.length;
    if (ratio === 1) return 'Excellent ! Score parfait.';
    if (ratio >= 0.7) return 'Très bien joué !';
    if (ratio >= 0.5) return 'Pas mal, continue à apprendre !';
    return "Continue d'explorer les sourates pour progresser.";
  }

  confettiPieces = Array.from({ length: 30 }, (_, i) => i);

  confettiColor(i: number): string {
    const colors = ['#10b981', '#0d9488', '#34d399', '#facc15', '#f472b6', '#60a5fa'];
    return colors[i % colors.length];
  }

  confettiLeft(i: number): string {
    return `${(i * 37) % 100}%`;
  }

  confettiDelay(i: number): string {
    return `${(i % 10) * 0.15}s`;
  }

  confettiDuration(i: number): string {
    return `${2 + (i % 5) * 0.3}s`;
  }
}
