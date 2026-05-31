import { Component, OnInit } from '@angular/core';
import { JavaPlayerService } from '../../core/services/java-player.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonCardContent,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonTextarea,
  IonButton,
  IonList,
} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  imports: [
    IonHeader,
    CommonModule,
    FormsModule,
    IonToolbar,
    IonTitle,
    IonContent,
    HeaderComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonCardContent,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonTextarea,
    IonButton,
    IonList,
  ],
})
export class NewsPage implements OnInit {
  players: any[] = [];
  newsList: any[] = [];

  form = {
    idJugador: '',
    titulo: '',
    cuerpo: '',
    fechaCreacion: new Date().toISOString(),
  };

  constructor(private playerService: JavaPlayerService) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe((res: any) => {
      this.players = Array.isArray(res)
        ? res
        : res?.data?.players || res?.data || [];
    });
  }

  createNews() {
    this.playerService.createNews(this.form).subscribe(() => {
      this.form = {
        idJugador: '',
        titulo: '',
        cuerpo: '',
        fechaCreacion: new Date().toISOString(),
      };
    });
  }
}
