import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ideal-team',
  templateUrl: './ideal-team.page.html',
  styleUrls: ['./ideal-team.page.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonIcon,
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonCard,
    IonCardContent,
    IonSpinner,
  ],
})
export class IdealTeamPage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);

  players: any[] = [];
  aiResponse: any = null;
  errorMessage = '';
  loading = false;

  ngOnInit() {
    this.loadAvailablePlayers();
  }

  loadAvailablePlayers() {
    this.playerFactory
      .getService()
      .getPlayers()
      .subscribe({
        next: (res: any) => {
          this.players = res.data?.players || res.players || res || [];
        },
        error: (err) => console.error('Error al recuperar jugadores', err),
      });
  }

  generateDreamTeam() {
    if (this.players.length === 0) {
      this.errorMessage = 'Inserta algunos jugadores en la base de datos local primero para que el sistema pueda evaluar y confeccionar el equipo ideal.';
      this.aiResponse = null;
      return;
    }

    this.loading = true;
    this.aiResponse = null;
    this.errorMessage = '';

    this.playerFactory
      .getService()
      .getEquipoIdeal()
      .subscribe({
        next: (res: any) => {
          this.aiResponse = res.data || res;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener el equipo ideal:', err);
          this.errorMessage = 'Ocurrió un error al conectar con el servicio de IA del backend.';
          this.loading = false;
        }
      });
  }
}