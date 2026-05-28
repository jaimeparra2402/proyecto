import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ListComponent {
  @Input() items: any[] = [];
  @Input() type: 'players' | 'comments' | 'external' = 'players';
  @Input() isAdmin: boolean = false;
  @Input() isLoggedIn: boolean = false;
  
  @Output() onSelect = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() onImportPlayer = new EventEmitter<any>();

  constructor() {
    addIcons({
      'cloud-download-outline': cloudDownloadOutline,

    });
  }

  getStars(rating: any): number[] {
    if (!rating || isNaN(Number(rating))) {
      return [];
    }
    return Array(Math.floor(Number(rating))).fill(0);
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  selectItem(item: any) {
    this.onSelect.emit(item);
  }

  editItem(item: any, event: Event) {
    event.stopPropagation();
    this.edit.emit(item);
  }

  importSinglePlayer(item: any) {
    this.onImportPlayer.emit(item);
  }

  deleteItem(item: any, event: Event) {
    event.stopPropagation();
    this.delete.emit(item);
  }
}