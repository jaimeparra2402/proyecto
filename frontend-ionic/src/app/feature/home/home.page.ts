import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { AuthService } from '../../core/services/auth.service'; // 👈 Tu servicio con el rol
import { ApiToggleComponent } from '../../shared/api-toggle/api-toggle.component';
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
  IonButton,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ApiToggleComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonSearchbar,
    IonButton,
    IonCard,
    IonCardContent,
  ],
})
export class HomePage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);
  public authService = inject(AuthService); // 👈 DEBE SER PUBLIC PARA EL HTML
  private router = inject(Router);

  players: any[] = [];
  searchName = '';
  searchTeam = '';

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    const filters: any = {};
    if (this.searchName) filters.name = this.searchName;
    if (this.searchTeam) filters.team = this.searchTeam;

    this.playerFactory
      .getService()
      .getPlayers(filters)
      .subscribe({
        next: (data) => this.players = data,
        error: (err) => console.error(err),
      });
  }

  // NAVEGACIÓN PÚBLICA DE USUARIOS
  goToImportApi() {
    this.router.navigate(['/import-api']);
  }

  goToAddPlayerForm() {
    this.router.navigate(['/add-player']);
  }

  goToIdealTeam() {
    this.router.navigate(['/ideal-team']);
  }

  goToViewNews() {
    this.router.navigate(['/view-news-corba']);
  }

  // NAVEGACIÓN EXCLUSIVA ADMIN
  goToCreateNewsCorba() {
    this.router.navigate(['/create-news-corba']);
  }

  async logout() {
    await this.authService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['/landing']);
  }
}