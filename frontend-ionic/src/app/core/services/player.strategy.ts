import { Observable } from 'rxjs';

export interface PlayerStrategy {
  getPlayers(filters?: any): Observable<any[]>;
  createPlayer(player: any): Observable<any>;
  getPlayerById(id: string): Observable<any>;
  deletePlayer(id: string): Observable<any>;
  addComment(playerId: string, comment: any): Observable<any>;
}