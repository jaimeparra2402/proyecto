import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodePlayerService } from '../../core/services/node-player.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { ListComponent } from '../../shared/list/list.component';
import { LEAGUES, SEASONS } from '../../core/constants/leagues.constants';

@Component({
  selector: 'app-player-search',
  templateUrl: './player-search.page.html',
  styleUrls: ['./player-search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonButton,
    IonIcon,
    ListComponent,
  ],
})
export class PlayerSearchPage {
  private playerService = inject(NodePlayerService);
  private router = inject(Router);

  players: any[] = [];
  loading = false;
  searched = false;

  searchName = '';
  searchLeague = '';
  searchSeason = '';

  leagues = LEAGUES;
  seasons = SEASONS;

  get formValid(): boolean {
    return (
      this.searchName.length >= 3 && !!this.searchLeague && !!this.searchSeason
    );
  }

  goToDetail(player: any) {
    const playerId = player._id || player.id; // Controla ambos formatos de ID
    if (playerId) {
      this.router.navigate(['/player-detail', playerId]);
    }
  }

  search() {
    if (!this.formValid) return;

    this.loading = true;
    this.searched = true;

    this.playerService
      .searchExternalPlayer({
        search: this.searchName,
        league: this.searchLeague,
        season: this.searchSeason,
      })
      .subscribe({
        next: (data) => {
          this.players = data.players || data.data || data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }
}
