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
import { footballOutline, alertCircleOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HeaderComponent } from "src/app/shared/header/header.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput,
    IonButton, IonButtons, IonBackButton, IonIcon, IonSpinner, IonCard, IonCardContent,
    HeaderComponent
]
})
export class LoginPage {
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
    addIcons({ footballOutline, alertCircleOutline, eyeOutline, eyeOffOutline });
  }

  get formValid(): boolean {
    return !!this.email && !!this.password;
  }

  async onLogin() {
    this.emailTouched = true;
    this.passwordTouched = true;
    this.errorMessage = '';

    if (!this.formValid) return;

    this.loading = true;
    try {
      const token = await this.authService.login(this.email, this.password);
      localStorage.setItem('token', token);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = 'Credenciales incorrectas o error en el sistema.';
    } finally {
      this.loading = false;
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}