import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonAvatar, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';
import { PlayerFactoryService } from '../../services/player-factory.service';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.page.html',
  styleUrls: ['./player-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonAvatar, IonItem, IonLabel, IonList, IonListHeader, IonRow, IonCol, IonIcon
  ]
})
export class PlayerDetailPage implements OnInit {
  player: any;

  constructor(
    private route: ActivatedRoute,
    private playerFactory: PlayerFactoryService
  ) {}

  ngOnInit() {
    const playerId = this.route.snapshot.paramMap.get('id');
    if (playerId) {
      this.loadPlayer(playerId);
    }
  }

  loadPlayer(id: string) {
    this.playerFactory.getStrategy().getPlayerById(id).subscribe({
      next: (response: any) => {
        this.player = response.data ? response.data : response;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}