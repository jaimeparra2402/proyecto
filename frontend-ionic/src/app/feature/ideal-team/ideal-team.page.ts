import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../../environments/environment';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonIcon,
  IonBadge,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ideal-team',
  templateUrl: './ideal-team.page.html',
  styleUrls: ['./ideal-team.page.scss'],
  standalone: true,
  imports: [
    IonBadge,
    IonIcon,
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonCard,
    IonCardContent,
    IonSpinner,
  ],
})
export class IdealTeamPage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);

  players: any[] = [];
  aiResponse: any = null;
  errorMessage = '';
  loading = false;

  ngOnInit() {
    this.loadAvailablePlayers();
  }

  loadAvailablePlayers() {
    this.playerFactory
      .getService()
      .getPlayers()
      .subscribe({
        next: (res: any) => {
          this.players = res.data?.players || res.players || res || [];
        },
        error: (err) => console.error('Error al recuperar jugadores', err),
      });
  }

  async generateDreamTeam() {
    if (this.players.length === 0) {
      this.errorMessage = 'Inserta algunos jugadores en la base de datos local primero para que el sistema pueda evaluar y confeccionar el equipo ideal.';
      this.aiResponse = null;
      return;
    }

    this.loading = true;
    this.aiResponse = null;
    this.errorMessage = '';

    try {
      const ai = new GoogleGenerativeAI(environment.geminiApiKey);
      
      const model = ai.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const playerListText = this.players
        .map((p) => `- ${p.name} (Posición: ${p.position}, Equipo: ${p.team || 'Sin equipo'})`)
        .join('\n');

      const prompt = `Actúa como un entrenador experto de fútbol profesional. Analiza los siguientes jugadores disponibles:\n${playerListText}\n\nGenera un once ideal siguiendo estrictamente esta estructura JSON:\n{\n  "formacion": "4-3-3",\n  "once_ideal": [\n    { "nombre": "Nombre", "posicion": "Posición", "motivo": "Motivo" }\n  ],\n  "analisis_tactico": "Texto largo explicativo"\n}`;

      const result = await model.generateContent(prompt);
      const textResponse = result.response.text();
      
      this.aiResponse = JSON.parse(textResponse);
    } catch (error) {
      console.error(error);
      this.errorMessage = 'Ocurrió un error al contactar con el servicio de IA o al procesar la respuesta. Revisa tu API key.';
    } finally {
      this.loading = false;
    }
  }
}