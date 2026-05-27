import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayerStrategy } from './player.strategy';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs'; // 👈 1. CORRECCIÓN: Añadido 'from' aquí
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class JavaPlayerService implements PlayerStrategy {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // URL Base para el backend en Java (Spring Boot)
  private apiUrl = `${environment.apiJava}/players`;

  // =========================================================================
  // SECCIÓN: JUGADORES (CRUD)
  // =========================================================================

  getPlayers(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filters });
  }

  getPlayerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPlayer(player: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, player);
  }

  // 🆕 AÑADIDO: Actualizar jugador
  updatePlayer(id: string, player: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: string): Observable<any> {
    return from(this.authService.getActiveToken()).pipe(
      switchMap(token => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }

  // =========================================================================
  // SECCIÓN: COMENTARIOS Y VALORACIONES
  // =========================================================================

  // 🆕 AÑADIDO: Obtener comentarios de un jugador
  getComments(playerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${playerId}/comments`);
  }

  addComment(playerId: string, comment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${playerId}/comments`, comment);
  }

  deleteComment(playerId: string, commentId: string): Observable<any> {
    return from(this.authService.getActiveToken()).pipe(
      switchMap(token => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(`${this.apiUrl}/${playerId}/comments/${commentId}`, { headers });
      })
    );
  }

  // =========================================================================
  // SECCIÓN: EXTERNA (API-Football) - Adaptado a las rutas de tu API Java
  // =========================================================================

  // 🆕 AÑADIDO: Buscar jugadores en la API externa desde Java
  searchExternalPlayer(searchParams: {
    search: string;
    league?: string;
    season?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/external/search-player`, {
      params: searchParams,
    });
  }

  // 🆕 AÑADIDO: Importar jugadores seleccionados a la base de datos de Java
  importPlayers(importData: {
    players: any[];
    latitude?: number;
    longitude?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/external/import`, importData);
  }

  // =========================================================================
  // SECCIÓN: IA (Inteligencia Artificial)
  // =========================================================================

  // 🆕 AÑADIDO: Obtener el equipo ideal generado por la IA en Java
  getEquipoIdeal(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/external/equipo-ideal`);
  }
}
