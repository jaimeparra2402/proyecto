import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { AuthService } from '../../core/services/auth.service'; // 👈 Importamos el servicio de autenticación
import { ListComponent } from '../../shared/list/list.component';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  chevronBackOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.page.html',
  styleUrls: ['./player-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ListComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
  ],
})
export class PlayerListPage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);
  public authService = inject(AuthService); // 👈 Inyectamos como público para usarlo en el HTML
  private router = inject(Router);

  players: any[] = [];

  constructor() {
    // Registramos los iconos de edición y eliminación que usará el listado
    addIcons({
      'arrow-back': arrowBackOutline,
      'chevron-back': chevronBackOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
    });
  }

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playerFactory
      .getService()
      .getPlayers()
      .subscribe({
        next: (response: any) => {
          console.log('¡RESPUESTA CRUDA DEL BACKEND!', response);

          // Extraemos los jugadores de la respuesta según tu estructura de Node
          const rawPlayers = response?.data?.players || response || [];

          // Mapeamos los campos para asegurarnos de que el listado compartido los entienda perfectamente
          this.players = rawPlayers.map((player: any) => ({
            ...player,
            // Si el backend trae 'image', el componente compartido usará 'imageUrl'
            imageUrl:
              player.image ||
              player.imageUrl ||
              'assets/placeholder-player.png',
          }));

          console.log('Datos limpios enviados a la lista:', this.players);
        },
        error: (err) => console.error('Error al cargar jugadores:', err),
      });
  }

  goToDetail(player: any) {
    const playerId = player._id || player.id; // Controla ambos formatos de ID
    if (playerId) {
      this.router.navigate(['/player-detail', playerId]);
    }
  }
  // ACCIONES EXCLUSIVAS DEL ADMINISTRADOR

  onEditPlayer(player: any) {
    console.log('Editar jugador:', player);
    // Aquí puedes redirigir al formulario de edición pasando el ID, ej:
    // this.router.navigate(['/edit-player', player._id || player.id]);
  }

  onDeletePlayer(player: any) {
    console.log('Eliminar jugador:', player);
    const id = player._id || player.id;

    // Llamada a tu servicio factory/estrategia para eliminar de la base de datos
    this.playerFactory
      .getService()
      .deletePlayer(id)
      .subscribe({
        next: () => {
          console.log('Jugador eliminado con éxito');
          this.loadPlayers(); // Recargamos la lista automáticamente
        },
        error: (err) => console.error('Error al eliminar el jugador:', err),
      });
  }
}
