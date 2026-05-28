import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NodePlayerService } from '../../core/services/node-player.service';
import { Geolocation } from '@capacitor/geolocation';
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

  async savePlayerToLocal(player: any) {
    let latitude = 40.416775;
    let longitude = -3.703790;

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      latitude = coordinates.coords.latitude;
      longitude = coordinates.coords.longitude;
    } catch (e) {
      console.warn('No se pudo obtener la ubicación para la importación, usando coordenadas por defecto.');
    }

    const playerData = {
      name: player.name,
      team: player.team,
      league: player.league,
      position: player.position,
      imageUrl: player.imageUrl || player.image,
      latitude: latitude,
      longitude: longitude,
      stats: {
        goals: player.stats?.goals || 0,
        assists: player.stats?.assists || 0,
        matchesPlayed: player.stats?.matchesPlayed || 0
      }
    };

    this.playerService.createPlayer(playerData).subscribe({
      next: (response) => {
        console.log('Jugador guardado localmente con éxito', response);
        this.router.navigate(['/player-list']);
      },
      error: (error) => {
        console.error('Error al guardar el jugador en la base de datos', error);
      }
    });
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

  get hasToken(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }
}