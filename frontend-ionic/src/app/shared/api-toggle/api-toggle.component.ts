import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonItem, IonLabel, IonToggle } from '@ionic/angular/standalone'; 
import { BackendToggleService, BackendType } from '../../core/services/backend-toggle.service'; 

@Component({
  selector: 'app-api-toggle',
  templateUrl: './api-toggle.component.html',
  styleUrls: ['./api-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel, IonToggle] 
export class ApiToggleComponent implements OnInit {
  current: BackendType = 'NODE';

  constructor(private toggleService: BackendToggleService) {}

  ngOnInit() {
    this.toggleService.backend$.subscribe(backend => {
      this.current = backend;
    });
  }

  onToggleChange(event: any) {
    const isJava = event.detail.checked;
    this.toggleService.setBackend(isJava ? 'JAVA' : 'NODE');
  }
}