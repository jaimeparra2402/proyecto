import { Observable } from 'rxjs';


export interface PlayerStrategy {

  getPlayers(filters?: any): Observable<any[]>;
  createPlayer(player: any): Observable<any>;
  getPlayerById(id: string): Observable<any>;
  updatePlayer(id: string, player: any): Observable<any>;
  deletePlayer(id: string): Observable<any>;

  getComments(playerId: string): Observable<any>;
  addComment(
    playerId: string, 
    comment: { author?: string; text: string; rating: number; createdAt?: Date }
  ): Observable<any>;
  deleteComment(playerId: string, commentId: string): Observable<any>;

  searchExternalPlayer(searchParams: {
    search: string;
    league?: string;
    season?: string;
  }): Observable<any>;

  getEquipoIdeal(): Observable<any>;
}