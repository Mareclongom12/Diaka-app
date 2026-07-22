import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FaqItem {
  categorie: 'Bases' | 'Pratique' | 'Coran';
  question: string;
  reponse: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  categories: ('Toutes' | 'Bases' | 'Pratique' | 'Coran')[] = ['Toutes', 'Bases', 'Pratique', 'Coran'];
  activeCategory = signal<'Toutes' | 'Bases' | 'Pratique' | 'Coran'>('Toutes');
  openIndex = signal<number | null>(null);

  faqItems: FaqItem[] = [
    { categorie: 'Bases', question: 'Quels sont les piliers de l\'islam ?', reponse: 'Il y en a cinq : la chahada (attestation de foi), la prière (salat), l\'aumône (zakat), le jeûne du Ramadan (sawm) et le pèlerinage à La Mecque (hajj) pour qui en a les moyens.' },
    { categorie: 'Bases', question: 'Qu\'est-ce que la chahada ?', reponse: 'L\'attestation qu\'il n\'y a de divinité qu\'Allah et que Muhammad (ﷺ) est Son messager. C\'est le premier pilier et la porte d\'entrée dans l\'islam.' },
    { categorie: 'Bases', question: 'Combien de prières quotidiennes sont obligatoires ?', reponse: 'Cinq prières : Fajr (aube), Dhuhr (midi), Asr (après-midi), Maghrib (coucher du soleil) et Isha (nuit).' },
    { categorie: 'Pratique', question: 'Qu\'est-ce que les ablutions (wudu) ?', reponse: 'Un lavage rituel (mains, bouche, nez, visage, avant-bras, tête, oreilles, pieds) effectué avant chaque prière pour être en état de pureté.' },
    { categorie: 'Pratique', question: 'Que se passe-t-il pendant le Ramadan ?', reponse: 'Les musulmans jeûnent de l\'aube au coucher du soleil, s\'abstenant de nourriture, de boisson et de rapports intimes durant tout le mois.' },
    { categorie: 'Pratique', question: 'Qui est dispensé du jeûne du Ramadan ?', reponse: 'Les malades, les voyageurs, les femmes enceintes ou allaitantes, les personnes âgées et les enfants non pubères, selon des conditions précisées par les savants.' },
    { categorie: 'Coran', question: 'Qu\'est-ce que le Coran ?', reponse: 'Le livre sacré de l\'islam, considéré par les musulmans comme la parole d\'Allah révélée au prophète Muhammad (ﷺ) par l\'ange Gabriel.' },
    { categorie: 'Coran', question: 'Combien de sourates compte le Coran ?', reponse: '114 sourates au total, de tailles très variables : de 3 versets (Al-Kawthar) à 286 versets (Al-Baqara).' },
    { categorie: 'Coran', question: 'Quelle est la différence entre sourates mecquoises et médinoises ?', reponse: 'Les sourates mecquoises ont été révélées avant l\'émigration du prophète à Médine, les médinoises après. Elles diffèrent souvent par leur style et leurs thèmes.' },
    { categorie: 'Coran', question: 'Peut-on simplement écouter le Coran sans le lire ?', reponse: 'Oui, l\'écoute de la récitation est une forme de pratique reconnue et méritoire, complémentaire à la lecture du texte.' },
  ];

  filteredFaq = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'Toutes') return this.faqItems;
    return this.faqItems.filter(item => item.categorie === cat);
  });

  selectCategory(cat: 'Toutes' | 'Bases' | 'Pratique' | 'Coran'): void {
    this.activeCategory.set(cat);
    this.openIndex.set(null);
  }

  toggleItem(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
