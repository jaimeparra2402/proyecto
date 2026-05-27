import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiToggleComponent } from '../../shared/api-toggle/api-toggle.component';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
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
    IonButton,
  ],
})
export class HomePage {
  public authService = inject(AuthService);
  private router = inject(Router);

  // Extrae el nombre de usuario basándose en el email actual de Firebase
  getUsername(): string {
    const email = this.authService.currentUser()?.email;
    if (!email) return 'Usuario';
    const namePart = email.split('@')[0];
    // Formatear la primera letra en mayúscula para que quede más estético
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
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

  goToPlayerList() {
    this.router.navigate(['/player-list']);
  }

  goToSearchPlayers() {
    this.router.navigate(['/player-search']);
  }

  async logout() {
    await this.authService.logout();
    localStorage.removeItem('token');
    this.router.navigate(['/landing']);
  }
}
