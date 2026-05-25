import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonButtons, 
  IonBackButton, 
  IonCard, 
  IonCardContent 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonItem, 
    IonInput, 
    IonButton, 
    IonButtons, 
    IonBackButton, 
    IonCard, 
    IonCardContent
  ]
})
export class AddPlayerPage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);
  private router = inject(Router);

  name = '';
  team = '';
  league = '';
  image = '';
  
  latitude = 40.416775;
  longitude = -3.703790;
  
  private map!: L.Map;
  private marker!: L.Marker;

  ngOnInit() {
    this.initGeoAndMap();
  }

  async initGeoAndMap() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
    } catch (e) {
      console.warn('No se pudo obtener la ubicación actual, usando coordenadas por defecto.');
    }
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('mapId').setView([this.latitude, this.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.latitude, this.longitude], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.latitude = position.lat;
      this.longitude = position.lng;
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.latitude = e.latlng.lat;
      this.longitude = e.latlng.lng;
      this.marker.setLatLng([this.latitude, this.longitude]);
    });
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      this.image = image.webPath || '';
    } catch (error) {
      console.error('Cámara cerrada o error al capturar imagen', error);
    }
  }

  savePlayer() {
    if (!this.name || !this.team || !this.league) {
      alert('Por favor, rellena los campos obligatorios.');
      return;
    }

    const newPlayer = {
      name: this.name,
      team: this.team,
      league: this.league,
      image: this.image,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.playerFactory.getService().createPlayer(newPlayer).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err: any) => console.error('Error al guardar el jugador:', err)
    });
  }
}