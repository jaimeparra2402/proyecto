import { Observable } from 'rxjs';

export interface PlayerStrategy {
  // =========================================================================
  // SECCIÓN: JUGADORES (CRUD)
  // =========================================================================
  getPlayers(filters?: any): Observable<any[]>;
  createPlayer(player: any): Observable<any>;
  getPlayerById(id: string): Observable<any>;
  updatePlayer(id: string, player: any): Observable<any>;
  deletePlayer(id: string): Observable<any>;

  // =========================================================================
  // SECCIÓN: COMENTARIOS Y VALORACIONES
  // =========================================================================
  getComments(playerId: string): Observable<any>;
  addComment(
    playerId: string, 
    comment: { author?: string; text: string; rating: number; createdAt?: Date }
  ): Observable<any>;
  deleteComment(playerId: string, commentId: string): Observable<any>;

  // =========================================================================
  // SECCIÓN: EXTERNA (API-Football)
  // =========================================================================
  searchExternalPlayer(searchParams: {
    search: string;
    league?: string;
    season?: string;
  }): Observable<any>;
  
  importPlayers(importData: {
    players: any[];
    latitude?: number;
    longitude?: number;
  }): Observable<any>;

  // =========================================================================
  // SECCIÓN: IA (Inteligencia Artificial)
  // =========================================================================
  getEquipoIdeal(): Observable<any>;
}