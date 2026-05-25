import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { arrowBackOutline, chevronBackOutline } from 'ionicons/icons';
@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonButtons,
    IonBackButton,
  ],
})
export class PlayerListPage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);
  players: any[] = [];

  constructor() {
    addIcons({
      'arrow-back': arrowBackOutline,
      'chevron-back': chevronBackOutline
    });
  }

  ngOnInit() {
    this.playerFactory
      .getService()
      .getPlayers()
      .subscribe({
        next: (data) => {
          this.players = data;
        },
        error: (err) => console.error(err),
      });
  }
}