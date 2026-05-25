import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonInput, 
  IonButton,
  IonButtons, 
  IonBackButton 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    RouterLink,
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonItem, 
    IonInput, 
    IonButton,
    IonButtons, 
    IonBackButton 
  ]
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  errorMessage = '';

  async onRegister() {
    this.errorMessage = '';
    
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Por favor, rellena todos los campos.';
      return;
    }

    try {
      await this.authService.registerInFirebaseAndBackend(this.username, this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.error?.message || error.message || 'Error en el registro.';
    }
  }
}