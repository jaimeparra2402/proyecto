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

  private apiUrl = `${environment.apiJava}/players`;

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

  searchExternalPlayer(searchParams: {
    search: string;
    league?: string;
    season?: string;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/external/search-player`, {
      params: searchParams,
    });
  }

  importPlayers(importData: {
    players: any[];
    latitude?: number;
    longitude?: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/external/import`, importData);
  }

  getEquipoIdeal(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/external/equipo-ideal`);
  }
}
