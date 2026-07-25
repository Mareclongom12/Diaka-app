import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language';

interface QuizQuestion {
  key: string;
  correctIndex: number;
}

const CORRECT_INDEXES: number[] = [
  1, 2, 1, 0, 2, 1, 2, 1, 2, 1, 2, 1, 1, 0, 1, 0, 1, 1, 2, 1,
  1, 1, 0, 1, 1, 2, 0, 1, 1, 2, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2,
  1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 2, 0, 1, 1, 1, 0, 0, 0, 3, 0,
  1, 2, 1, 1,
];

const QUESTION_POOL: QuizQuestion[] = CORRECT_INDEXES.map((correctIndex, i) => ({
  key: String(i + 1),
  correctIndex,
}));

@Component({
  selector: 'app-quiz',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  private readonly QUESTIONS_PER_ROUND = 10;
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  questions: QuizQuestion[] = this.pickRandomQuestions();

  currentIndex = signal(0);
  score = signal(0);
  selectedOption = signal<number | null>(null);
  showAnswer = signal(false);
  finished = signal(false);

  currentQuestion = computed(() => {
    this.languageService.currentLang();
    const q = this.questions[this.currentIndex()];
    return {
      question: this.translate.instant(`QUIZ_QUESTIONS.${q.key}.q`),
      options: this.translate.instant(`QUIZ_QUESTIONS.${q.key}.o`) as string[],
      correctIndex: q.correctIndex,
    };
  });

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
    this.languageService.currentLang();
    const ratio = this.score() / this.questions.length;
    if (ratio === 1) return this.translate.instant('QUIZ.RESULT_PERFECT');
    if (ratio >= 0.7) return this.translate.instant('QUIZ.RESULT_GREAT');
    if (ratio >= 0.5) return this.translate.instant('QUIZ.RESULT_OK');
    return this.translate.instant('QUIZ.RESULT_LOW');
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
