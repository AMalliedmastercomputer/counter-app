import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

type SortMode = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  readonly searchTerm = signal('');
  readonly sortMode = signal<SortMode>('newest');
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  readonly visibleCounters = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const counters = [...this.counterService.counters()];

    const filtered = term
      ? counters.filter((counter) => counter.name.toLowerCase().includes(term))
      : counters;

    switch (this.sortMode()) {
      case 'oldest':
        return [...filtered].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case 'name-asc':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
      default:
        return [...filtered].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  onSearch(event: Event): void {
    const detail = event as CustomEvent<{ value?: string }>;
    this.searchTerm.set(detail.detail?.value ?? '');
  }

  onSortChange(event: Event): void {
    const detail = event as CustomEvent<{ value?: SortMode }>;
    const value = detail.detail?.value ?? 'newest';
    this.sortMode.set(value);
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    const toast = await this.toastController.create({
      message: 'Záznam byl odstraněn.',
      duration: 1800,
      position: 'bottom',
    });
    await toast.present();
  }

  async clear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Vymazat celou historii?',
      message: 'Tato akce smaže všechny uložené záznamy. Tuto akci nelze vrátit.',
      buttons: [
        {
          text: 'Zrušit',
          role: 'cancel',
        },
        {
          text: 'Vymazat',
          handler: async () => {
            await this.counterService.clear();
            const toast = await this.toastController.create({
              message: 'Historie byla vymazána.',
              duration: 1800,
              position: 'bottom',
            });
            await toast.present();
          },
        },
      ],
    });

    await alert.present();
  }
}