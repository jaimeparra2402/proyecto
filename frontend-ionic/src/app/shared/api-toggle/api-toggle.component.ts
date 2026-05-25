import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendToggleService, BackendType } from '../../core/services/backend-toggle.service';
import { IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-api-toggle',
  template: `
    <ion-item lines="none">
      <ion-label>Backend Activo:</ion-label>
      <ion-select [value]="currentBackend()" (ionChange)="changeBackend($event)">
        <ion-select-option value="NODE">Node.js (TRWM)</ion-select-option>
        <ion-select-option value="JAVA">Java (DWSC)</ion-select-option>
      </ion-select>
    </ion-item>
  `,
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel, IonSelect, IonSelectOption]
})
export class ApiToggleComponent {
  private toggleService = inject(BackendToggleService);

  currentBackend() {
    return this.toggleService.getBackend();
  }

  changeBackend(event: any) {
    const selected: BackendType = event.detail.value;
    this.toggleService.setBackend(selected);
    window.location.reload();
  }
}