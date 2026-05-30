import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { AuthService } from '../../core/services/auth.service';
import { ListComponent } from '../../shared/list/list.component';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  chevronBackOutline,
  createOutline,
  trashOutline,
  searchOutline,
  refreshOutline,
  personOutline,
  shieldOutline,
  calendarClearOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { HeaderComponent } from "src/app/shared/header/header.component";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonInput,
    IonButton,
    IonIcon,
    HeaderComponent
],
})
export class PlayerListPage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);
  public authService = inject(AuthService);
  private router = inject(Router);

  players: any[] = [];

  searchName: string = '';
  searchTeam: string = '';
  searchDate: string = '';

  constructor() {
    addIcons({
      'arrow-back': arrowBackOutline,
      'chevron-back': chevronBackOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
      'search-outline': searchOutline,
      'refresh-outline': refreshOutline,
      'person-outline': personOutline,
      'shield-outline': shieldOutline,
      'calendar-clear-outline': calendarClearOutline,
      'alert-circle-outline': alertCircleOutline
    });
  }

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    const filters: any = {};
    if (this.searchName.trim()) filters.name = this.searchName.trim();
    if (this.searchTeam.trim()) filters.team = this.searchTeam.trim();
    if (this.searchDate) filters.desdeFecha = this.searchDate;

    this.playerFactory
      .getService()
      .getPlayers(filters)
      .subscribe({
        next: (response: any) => {
          const rawPlayers = response?.data?.players || response || [];
          this.players = rawPlayers.map((player: any) => ({
            ...player,
            imageUrl: player.image || player.imageUrl || 'assets/placeholder-player.png',
          }));
        },
        error: (err) => console.error('Error al cargar los jugadores:', err),
      });
  }

  applyFilters() {
    this.loadPlayers();
  }

  clearFilters() {
    this.searchName = '';
    this.searchTeam = '';
    this.searchDate = '';
    this.loadPlayers();
  }

  goToDetail(player: any) {
    const playerId = player._id || player.id;
    if (playerId) {
      this.router.navigate(['/player-detail', playerId]);
    }
  }

  onEditPlayer(player: any) {
    const id = player._id || player.id;
    if (id) {
      this.router.navigate(['/edit-player', id]);
    }
  }

  onDeletePlayer(player: any) {
    const id = player._id || player.id;
    this.playerFactory
      .getService()
      .deletePlayer(id)
      .subscribe({
        next: () => {
          this.loadPlayers();
        },
        error: (err) => console.error('Error al eliminar el jugador:', err),
      });
  }
}