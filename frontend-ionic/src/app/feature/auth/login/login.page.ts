import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
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
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';

  async onLogin() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, introduce tu correo y contraseña.';
      return;
    }

    try {
      const token = await this.authService.login(this.email, this.password);
      localStorage.setItem('token', token);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = 'Credenciales incorrectas o error en el sistema.';
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}