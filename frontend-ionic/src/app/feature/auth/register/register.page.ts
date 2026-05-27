import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput,
  IonButton, IonButtons, IonBackButton, IonIcon, IonSpinner, IonCard, IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAddOutline, alertCircleOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput,
    IonButton, IonButtons, IonBackButton, IonIcon, IonSpinner, IonCard, IonCardContent
  ]
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPassword = false;
  emailTouched = false;
  passwordTouched = false;

  constructor() {
    addIcons({ personAddOutline, alertCircleOutline, eyeOutline, eyeOffOutline });
  }

  // Ahora el formulario es válido si hay correo y la contraseña tiene un largo de 6+
  get formValid(): boolean {
    return !!this.email && this.password.length >= 6;
  }

  async onRegister() {
    this.emailTouched = true;
    this.passwordTouched = true;
    this.errorMessage = '';

    if (!this.formValid) return;

    this.loading = true;
    try {
      // Modificado para pasar únicamente email y password
      await this.authService.registerInFirebaseAndBackend(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.error?.message || error.message || 'Error en el registro.';
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}