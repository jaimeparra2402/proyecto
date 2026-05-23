import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonList, IonItem, IonLabel, IonAvatar, IonSearchbar, 
  IonButton, IonIcon, IonModal, IonDatetime, IonDatetimeButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filter, calendarOutline } from 'ionicons/icons';

import { ApiToggleComponent } from '../../shared/api-toggle/api-toggle.component';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { BackendToggleService } from '../../core/services/backend-toggle.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
    IonList, IonItem, IonLabel, IonAvatar, IonSearchbar, 
    IonButton, IonIcon, IonModal, IonDatetime, IonDatetimeButton,
    ApiToggleComponent
  ],
})
export class HomePage implements OnInit {
  players: any[] = [];
  
  searchName: string = '';
  searchTeam: string = '';
  searchDate: string = '';

  constructor(
    private playerFactory: PlayerFactoryService,
    private toggleService: BackendToggleService
  ) {
    addIcons({ filter, calendarOutline });
  }

  ngOnInit() {
    this.toggleService.backend$.subscribe(() => {
      this.loadPlayers();
    });
  }

  loadPlayers() {
    const filters: any = {};
    if (this.searchName) filters.name = this.searchName;
    if (this.searchTeam) filters.teamLeague = this.searchTeam;
    if (this.searchDate) filters.createdAt = this.searchDate;

    this.playerFactory.getStrategy().getPlayers(filters).subscribe({
      next: (response: any) => {
        this.players = response.data ? response.data : response;
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.players = [];
      }
    });
  }

  onSearchChange() {
    this.loadPlayers();
  }

  onDateChange(event: any) {
    if (event.detail.value) {
      this.searchDate = event.detail.value.split('T')[0];
      this.loadPlayers();
    }
  }

  clearFilters() {
    this.searchName = '';
    this.searchTeam = '';
    this.searchDate = '';
    this.loadPlayers();
  }
}