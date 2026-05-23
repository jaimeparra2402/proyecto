import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayerStrategy } from './player.strategy';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NodePlayerService implements PlayerStrategy {
  private apiUrl = 'https://backend-node-1089195621635.europe-west1.run.app/api/players'; 
  constructor(private http: HttpClient) {}

  getPlayers(filters?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: filters });
  }
  getPlayerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  createPlayer(playerData: any): Observable<any> {
    return this.http.post(this.apiUrl, playerData);
  }
  deletePlayer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  addComment(playerId: string, commentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${playerId}/comments`, commentData);
  }
}