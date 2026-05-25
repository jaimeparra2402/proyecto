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
  IonSpinner 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ideal-team',
  templateUrl: './ideal-team.page.html',
  styleUrls: ['./ideal-team.page.scss'],
  standalone: true,
  imports: [
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
    IonSpinner
  ]
})
export class IdealTeamPage implements OnInit {
  private playerFactory = inject(PlayerFactoryService);

  players: any[] = [];
  aiResponse = '';
  loading = false;

  ngOnInit() {
    this.loadAvailablePlayers();
  }

  loadAvailablePlayers() {
    this.playerFactory.getService().getPlayers().subscribe({
      next: (data) => this.players = data,
      error: (err) => console.error('Error al recuperar jugadores', err)
    });
  }

  async generateDreamTeam() {
    if (this.players.length === 0) {
      this.aiResponse = 'Inserta algunos jugadores en la base de datos local primero para que el sistema pueda evaluar y confeccionar el equipo ideal.';
      return;
    }

    this.loading = true;
    this.aiResponse = '';

    try {
      const ai = new GoogleGenerativeAI(environment.geminiApiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const playerListText = this.players.map(p => `- ${p.name} (Equipo: ${p.team}, Posición: ${p.position || 'No definida'})`).join('\n');

      const prompt = `Actúa como un entrenador experto de fútbol profesional. Analiza la siguiente lista de jugadores disponibles y selecciona/genera una alineación óptima (un "Equipo Ideal") con su formación táctica (ej. 4-3-3) explicando brevemente la estrategia táctica adoptada:\n\n${playerListText}`;

      const result = await model.generateContent(prompt);
      this.aiResponse = result.response.text();
    } catch (error) {
      console.error(error);
      this.aiResponse = 'Ocurrió un error al contactar con el servicio de IA. Revisa tu API key de Google AI Studio.';
    } finally {
      this.loading = false;
    }
  }
}