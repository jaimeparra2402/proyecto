import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ListComponent {
  // PROPIEDADES DE ENTRADA (@Input)
  @Input() items: any[] = [];
  @Input() type: 'players' | 'comments' | 'external' = 'players';
  @Input() isAdmin: boolean = false; // 👈 NUEVO: Recibe si el usuario es admin o no

  // EVENTOS DE SALIDA (@Output)
  @Output() onSelect = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>(); // 👈 Para editar jugadores
  @Output() delete = new EventEmitter<any>(); // 👈 Para borrar jugadores o comentarios

  // Genera un array seguro basado en la puntuación del comentario
  getStars(rating: any): number[] {
    if (!rating || isNaN(Number(rating))) {
      return [];
    }
    return Array(Math.floor(Number(rating))).fill(0);
  }

  // Extrae las iniciales del jugador si no tiene foto de perfil
  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Emite el elemento completo al hacer clic para ver su detalle
  selectItem(item: any) {
    this.onSelect.emit(item);
  }

  // Captura el clic de edición, frena la propagación para que no se abra el detalle, y emite
  editItem(item: any, event: Event) {
    event.stopPropagation();
    this.edit.emit(item);
  }

  // Captura el clic de eliminación, frena la propagación, y emite el elemento a borrar
  deleteItem(item: any, event: Event) {
    event.stopPropagation();
    this.delete.emit(item);
  }
}
