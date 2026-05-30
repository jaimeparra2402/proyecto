import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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

  getStars(rating: any): number[] {
    if (!rating || isNaN(Number(rating))) {
      return [];
    }
    return Array(Math.floor(Number(rating))).fill(0);
  }

  selectItem(item: any) {
    this.onSelect.emit(item);
  }

  editItem(item: any) {
    this.edit.emit(item);
  }

  deleteItem(item: any) {
    this.delete.emit(item);
  }

  importSinglePlayer(item: any) {
    this.onImportPlayer.emit(item);
  }
}