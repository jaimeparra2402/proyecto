import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonLabel,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, personOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonLabel
  ]
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() defaultHref: string = '/player-list';
  @Input() showBackButton: boolean = true;
  @Input() forceLoggedOut: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  constructor() {
    addIcons({
      'log-out-outline': logOutOutline,
      'person-outline': personOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  get isAdmin() {
    return this.authService.isUserAdmin();
  }

  get currentUser() {
    if (this.forceLoggedOut) {
      return null; 
    }
    return this.authService.currentUser();
  }

  get userDisplayName(): string {
    const user = this.currentUser;
    if (!user) return '';
    return user.displayName || user.email?.split('@')[0] || 'Usuario';
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: `¿Estás seguro de que quieres cerrar sesión, ${this.userDisplayName}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: () => this.logout()
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}