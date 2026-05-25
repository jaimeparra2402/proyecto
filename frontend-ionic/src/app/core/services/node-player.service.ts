import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerStrategy } from './player.strategy';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodePlayerService implements PlayerStrategy {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiNode}/players`;

  getPlayers(filters?: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { params: filters });
  }

  getPlayerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deletePlayer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  addComment(playerId: string, comment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${playerId}/comments`, comment);
  }

  // ✅ FALTABA ESTE MÉTODO
  createPlayer(player: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, player);
  }
}