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
  IonAvatar,
  IonButton,
  IonInput,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,   // 👈 AÑADIDO
  IonCardTitle,    // 👈 AÑADIDO
  IonCardSubtitle, // 👈 AÑADIDO
  IonTextarea,     // 👈 AÑADIDO
  IonSelect,       // 👈 AÑADIDO
  IonSelectOption, // 👈 AÑADIDO
} from '@ionic/angular/standalone';

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
    IonAvatar,
    IonButton,
    IonInput,
    IonList,
    IonCard,
    IonCardContent,
    IonCardHeader,   // 👈 REGISTRADO
    IonCardTitle,    // 👈 REGISTRADO
    IonCardSubtitle, // 👈 REGISTRADO
    IonTextarea,     // 👈 REGISTRADO
    IonSelect,       // 👈 REGISTRADO
    IonSelectOption, // 👈 REGISTRADO
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
  
  author: string = '';
  commentText: string = '';
  rating: number = 5;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.playerId = params['id'];
      if (this.playerId) {
        this.loadPlayerDetails();
      }
    });
  }

  loadPlayerDetails() {
    this.playerFactory
      .getService()
      .getPlayerById(this.playerId)
      .subscribe({
        next: (data) => {
          this.player = data;
          this.comments = data.comments || [];
        },
        error: (err) => console.error('Error al cargar detalle:', err),
      });
  }

  sendComment() {
    if (!this.commentText.trim()) return;

    const commentData = {
      text: this.commentText,
      author: this.author || 'Anónimo',
      rating: this.rating,
      createdAt: new Date(),
    };

    this.playerFactory
      .getService()
      .addComment(this.playerId, commentData)
      .subscribe({
        next: () => {
          this.commentText = '';
          this.author = '';
          this.loadPlayerDetails();
        },
        error: (err) => console.error('Error al añadir comentario:', err),
      });
  }

  removeComment(commentId: string) {
    this.comments = this.comments.filter(c => c._id !== commentId && c.id !== commentId);
    if (this.player) {
      this.player.comments = this.comments;
    }
    this.playerFactory
      .getService()
      .addComment(this.playerId, this.player)
      .subscribe({
        next: () => this.loadPlayerDetails(),
        error: () => this.loadPlayerDetails(),
      });
  }

  editPlayer() {
    this.router.navigate(['/edit-player'], { queryParams: { id: this.playerId } });
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