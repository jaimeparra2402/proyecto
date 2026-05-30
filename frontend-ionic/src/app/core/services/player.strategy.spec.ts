import { Observable, of } from 'rxjs';
import { PlayerStrategy } from './player.strategy';

class MockPlayerService implements PlayerStrategy {
  getPlayers(filters?: any): Observable<any[]> {
    return of([{ id: '1', name: 'Test Player' }]);
  }
  createPlayer(player: any): Observable<any> {
    return of({ success: true });
  }
  getPlayerById(id: string): Observable<any> {
    return of({ id, name: 'Test Player' });
  }
  updatePlayer(id: string, player: any): Observable<any> {
    return of({ updated: true });
  }
  deletePlayer(id: string): Observable<any> {
    return of({ deleted: true });
  }
  getComments(playerId: string): Observable<any> {
    return of([{ text: 'Nice' }]);
  }
  addComment(playerId: string, comment: { author?: string; text: string; rating: number; createdAt?: Date }): Observable<any> {
    return of({ commentAdded: true });
  }
  deleteComment(playerId: string, commentId: string): Observable<any> {
    return of({ commentDeleted: true });
  }
  searchExternalPlayer(searchParams: { search: string; league?: string; season?: string; }): Observable<any> {
    return of({ players: [] });
  }
  getEquipoIdeal(): Observable<any> {
    return of({ tactics: '4-3-3' });
  }
}

describe('PlayerStrategy Interface (Pruebas Estructurales)', () => {
  let strategyImplementation: PlayerStrategy;

  beforeEach(() => {
    strategyImplementation = new MockPlayerService();
  });

  it('debería estar definida la estructura de la estrategia', () => {
    expect(strategyImplementation).toBeTruthy();
  });

  it('debería cumplir con las firmas del CRUD de Jugadores', (done) => {
    strategyImplementation.getPlayers().subscribe(players => {
      expect(players).toEqual([{ id: '1', name: 'Test Player' }]);
    });

    strategyImplementation.createPlayer({}).subscribe(res => {
      expect(res.success).toBeTrue();
    });

    strategyImplementation.getPlayerById('123').subscribe(player => {
      expect(player.id).toBe('123');
    });

    strategyImplementation.updatePlayer('123', {}).subscribe(res => {
      expect(res.updated).toBeTrue();
    });

    strategyImplementation.deletePlayer('123').subscribe(res => {
      expect(res.deleted).toBeTrue();
      done(); // Notifica a Jasmine que los flujos asíncronos terminaron
    });
  });

  it('debería cumplir con las firmas del CRUD de Comentarios y módulos adicionales', (done) => {
    strategyImplementation.getComments('1').subscribe(comments => {
      expect(comments.length).toBe(1);
    });

    strategyImplementation.addComment('1', { text: 'Crack', rating: 5 }).subscribe(res => {
      expect(res.commentAdded).toBeTrue();
    });

    strategyImplementation.deleteComment('1', 'c1').subscribe(res => {
      expect(res.commentDeleted).toBeTrue();
    });

    strategyImplementation.searchExternalPlayer({ search: 'Messi' }).subscribe(res => {
      expect(res.players).toEqual([]);
    });

    strategyImplementation.getEquipoIdeal().subscribe(res => {
      expect(res.tactics).toBe('4-3-3');
      done();
    });
  });
});