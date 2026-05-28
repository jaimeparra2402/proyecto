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
  private apiUrl = `${environment.apiNode}/players`;
  private apiExternalUrl = `${environment.apiNode}/external`;

  getPlayers(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filters });
  }

  createPlayer(player: any): Observable<any> {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post<any>(this.apiUrl, player, { headers });
  }

  getPlayerById(id: string): Observable<any> {
    return this.http.get<any>(`${`${this.apiUrl}/${id}`}`);
  }

  updatePlayer(id: string, player: any): Observable<any> {

    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    const headers = {Authorization: `Bearer ${token}`};
    return this.http.put<any>(`${`${this.apiUrl}/${id}`}`, player, {headers});
  }

  deletePlayer(id: string): Observable<any> {
    return from(this.authService.getActiveToken()).pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(`${`${this.apiUrl}/${id}`}`, { headers });
      }),
    );
  }

  getComments(playerId: string): Observable<any> {
    return this.http.get<any>(`${`${this.apiUrl}/${playerId}/comments`}`);
  }

  addComment(
    playerId: string,
    comment: { text: string; rating: number },
  ): Observable<any> {
    return this.http.post<any>(
      `${`${this.apiUrl}/${playerId}/comments`}`,
      comment,
    );
  }

  deleteComment(playerId: string, commentId: string): Observable<any> {
    return from(this.authService.getActiveToken()).pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.delete<any>(
          `${`${this.apiUrl}/${playerId}/comments/${commentId}`}`,
          { headers },
        );
      }),
    );
  }

  searchExternalPlayer(searchParams: {
    search: string;
    league?: string;
    season?: string;
  }): Observable<any> {
    return this.http.get<any>(`${`${this.apiExternalUrl}/search-player`}`, {
      params: searchParams,
    });
  }

  importPlayers(importData: {
    players: any[];
    latitude?: number;
    longitude?: number;
  }): Observable<any> {
    return this.http.post<any>(
      `${`${this.apiExternalUrl}/import`}`,
      importData,
    );
  }

  getEquipoIdeal(): Observable<any> {
    return from(this.authService.getActiveToken()).pipe(
      switchMap((token) => {
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<any>(`${`${this.apiExternalUrl}/equipo-ideal`}`, {
          headers,
        });
      }),
    );
  }
}
