import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { AuthService } from '../../core/services/auth.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline, chatbubbleEllipsesOutline } from 'ionicons/icons';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.page.html',
  styleUrls: ['./player-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonList,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonIcon
  ],
})
export class PlayerDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playerFactory = inject(PlayerFactoryService);
  public authService = inject(AuthService);

  playerId: string = '';
  player: any = null;
  comments: any[] = [];
  
  // Campos del formulario requeridos
  author: string = '';
  commentText: string = '';
  rating: number = 5;

  constructor() {
    addIcons({ star, starOutline, 'chatbubble-ellipses-outline': chatbubbleEllipsesOutline });
  }

  ngOnInit() {
    this.playerId = this.route.snapshot.paramMap.get('id') || '';
    if (this.playerId) {
      this.loadPlayerDetails();
    } else {
      console.error('No se encontró el ID del jugador en la ruta');
      this.router.navigate(['/home']);
    }
  }

  loadPlayerDetails() {
    this.playerFactory
      .getService()
      .getPlayerById(this.playerId)
      .subscribe({
        next: (data: any) => {
          this.player = data?.data?.player || data; // Maneja la envoltura de respuesta si existe
          this.comments = this.player?.comments || [];
        },
        error: (err) => console.error('Error al cargar detalle:', err),
      });
  }

  sendComment() {
    // Validación de texto vacío y límite de 1000 caracteres exigido
    if (!this.commentText.trim() || this.commentText.length > 1000) return;

    const commentData = {
      author: this.author.trim() || 'Anónimo',
      text: this.commentText.trim(),
      rating: Number(this.rating),
      createdAt: new Date(),
    };

    this.playerFactory
      .getService()
      .addComment(this.playerId, commentData)
      .subscribe({
        next: () => {
          this.commentText = '';
          this.author = '';
          this.rating = 5;
          this.loadPlayerDetails(); // Recarga la ficha y la lista de comentarios
        },
        error: (err) => console.error('Error al añadir comentario:', err),
      });
  }

  removeComment(commentId: string) {
    this.playerFactory
      .getService()
      .deleteComment(this.playerId, commentId)
      .subscribe({
        next: () => this.loadPlayerDetails(),
        error: (err) => console.error('Error al eliminar comentario:', err),
      });
  }

  editPlayer() {
    this.router.navigate(['/edit-player', this.playerId]);
  }

  deletePlayer() {
    this.playerFactory
      .getService()
      .deletePlayer(this.playerId)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => console.error('Error al eliminar jugador:', err),
      });
  }
}