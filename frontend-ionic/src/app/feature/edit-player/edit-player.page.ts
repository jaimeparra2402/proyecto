import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonInput,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  shieldOutline,
  trophyOutline,
  optionsOutline,
  imageOutline,
  saveOutline,
  footballOutline,
  checkmarkDoneOutline,
  starOutline
} from 'ionicons/icons';
import { HeaderComponent } from "src/app/shared/header/header.component";

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.page.html',
  styleUrls: ['./edit-player.page.scss'],
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
    IonInput,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    HeaderComponent
]
})
export class EditPlayerPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playerFactory = inject(PlayerFactoryService);

  playerId: string = '';
  player: any = null;

  constructor() {
    addIcons({
      'person-outline': personOutline,
      'shield-outline': shieldOutline,
      'trophy-outline': trophyOutline,
      'options-outline': optionsOutline,
      'image-outline': imageOutline,
      'save-outline': saveOutline,
      'football-outline': footballOutline,
      'checkmark-done-outline': checkmarkDoneOutline,
      'star-outline': starOutline
    });
  }

  ngOnInit() {
    this.playerId = this.route.snapshot.paramMap.get('id') || '';
    if (this.playerId) {
      this.loadPlayer();
    } else {
      this.router.navigate(['/player-list']);
    }
  }

  loadPlayer() {
    this.playerFactory
      .getService()
      .getPlayerById(this.playerId)
      .subscribe({
        next: (response: any) => {
          const data = response?.data?.player || response;
          
          this.player = {
            name: data.name,
            team: data.team,
            league: data.league || '',
            position: this.formatPosition(data.position), 
            imageUrl: data.imageUrl || data.image || '',
            latitude: data.latitude,
            longitude: data.longitude,
            stats: {
              goals: data.stats?.goals ?? 0,
              assists: data.stats?.assists ?? 0,
              matchesPlayed: data.stats?.matchesPlayed ?? 0
            }
          };
        },
        error: (err) => {
          console.error('Error al recuperar jugador:', err);
          this.router.navigate(['/player-list']);
        }
      });
  }

  formatPosition(pos: string): string {
    if (!pos) return 'GK';
    const cleanPos = pos.trim().toUpperCase();
    if (cleanPos.includes('GOAL') || cleanPos === 'GK' || cleanPos.includes('POR')) return 'GK';
    if (cleanPos.includes('DEF') || cleanPos === 'DF') return 'DF';
    if (cleanPos.includes('MID') || cleanPos === 'MF' || cleanPos.includes('MED')) return 'MF';
    if (cleanPos.includes('FOR') || cleanPos === 'FW' || cleanPos.includes('DEL') || cleanPos.includes('ATT')) return 'FW';
    return pos; 
  }

  submitUpdate() {
    if (!this.player.name || !this.player.team || !this.player.position) {
      alert('Por favor, rellena todos los campos requeridos.');
      return;
    }

    const updatedData = {
      ...this.player,
      stats: {
        goals: Number(this.player.stats.goals) || 0,
        assists: Number(this.player.stats.assists) || 0,
        matchesPlayed: Number(this.player.stats.matchesPlayed) || 0
      }
    };

    this.playerFactory
      .getService()
      .updatePlayer(this.playerId, updatedData)
      .subscribe({
        next: () => {
          this.router.navigate(['/player-detail', this.playerId]);
        },
        error: (err) => console.error('Error al actualizar el jugador:', err)
      });
  }
}