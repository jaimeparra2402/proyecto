import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { PlayerStrategy } from './player.strategy';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NodePlayerService implements PlayerStrategy {
  private http = inject(HttpClient);
private authService = inject(AuthService);
  // URLs Base separadas por contexto según tu Swagger
  private apiUrl = `${environment.apiNode}/players`;
  private apiExternalUrl = `${environment.apiNode}/external`;

  // =========================================================================
  // SECCIÓN: JUGADORES (CRUD, Comentarios y Valoraciones)
  // =========================================================================

  // GET /api/players
  getPlayers(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filters });
  }

  // POST /api/players
  createPlayer(player: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, player);
  }

  // GET /api/players/{id}
  getPlayerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // PUT /api/players/{id}
  updatePlayer(id: string, player: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, player);
  }

  // DELETE /api/players/{id}
  deletePlayer(id: string): Observable<any> {
    return from(this.authService.getActiveToken()).pipe(
      switchMap(token => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
      })
    );
  }

  // GET /api/players/{id}/comments
  getComments(playerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${playerId}/comments`);
  }

  // POST /api/players/{id}/comments
  addComment(
    playerId: string,
    comment: { text: string; rating: number },
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${playerId}/comments`, comment);
  }

  // DELETE /api/players/{playerId}/comments/{commentId}
  deleteComment(playerId: string, commentId: string): Observable<any> {
    return from(this.authService.getActiveToken()).pipe(
      switchMap(token => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(`${this.apiUrl}/${playerId}/comments/${commentId}`, { headers });
      })
    );
  }

  // =========================================================================
  // SECCIÓN: EXTERNA (API-Football)
  // =========================================================================

  // GET /api/external/search-player
  searchExternalPlayer(searchParams: {
    search: string;
    league?: string;
    season?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiExternalUrl}/search-player`, {
      params: searchParams,
    });
  }

  // POST /api/external/import
  importPlayers(importData: {
    players: any[];
    latitude?: number;
    longitude?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiExternalUrl}/import`, importData);
  }

  // =========================================================================
  // SECCIÓN: IA (Inteligencia Artificial)
  // =========================================================================

  // GET /api/external/equipo-ideal
  getEquipoIdeal(): Observable<any> {
    return this.http.get<any>(`${this.apiExternalUrl}/equipo-ideal`);
  }
}
