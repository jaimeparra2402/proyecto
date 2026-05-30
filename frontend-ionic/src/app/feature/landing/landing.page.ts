import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiToggleComponent } from '../../shared/api-toggle/api-toggle.component';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/angular/standalone';
import { HeaderComponent } from "src/app/shared/header/header.component";
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ApiToggleComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    HeaderComponent
],
})
export class LandingPage {
  private router = inject(Router);

  ionViewWillEnter() {
    localStorage.clear();
  }

  ngOnInit() {
    localStorage.clear();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToList() {
    this.router.navigate(['/player-list']);
  }
}