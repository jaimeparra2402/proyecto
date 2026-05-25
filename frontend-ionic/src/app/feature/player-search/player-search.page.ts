import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonButtons, 
  IonBackButton, 
} from '@ionic/angular/standalone';

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
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonButtons, 
    IonBackButton, 
  ],
})
export class PlayerSearchPage {
  private playerFactory = inject(PlayerFactoryService);

  players: any[] = [];
  searchName = '';
  searchTeam = '';

  loadPlayers() {
    if (!this.searchName && !this.searchTeam) {
      this.players = [];
      return;
    }

    const filters: any = {};
    if (this.searchName) filters.name = this.searchName;
    if (this.searchTeam) filters.team = this.searchTeam;

    this.playerFactory
      .getService()
      .getPlayers(filters)
      .subscribe({
        next: (data) => {
          this.players = data;
        },
        error: (err) => console.error(err),
      });
  }
}