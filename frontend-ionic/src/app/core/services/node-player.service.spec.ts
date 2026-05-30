import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NodePlayerService } from './node-player.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

describe('NodePlayerService (Pruebas Unitarias)', () => {
  let service: NodePlayerService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const baseUrl = `${environment.apiNode}/players`;
  const externalUrl = `${environment.apiNode}/external`;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getActiveToken']);
    // Configuramos el token asíncrono por defecto para los métodos reactivos con switchMap
    mockAuthService.getActiveToken.and.returnValue(Promise.resolve('async-mock-token'));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NodePlayerService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(NodePlayerService);
    httpMock = TestBed.inject(HttpTestingController);
    
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden peticiones HTTP colgadas
  });

  it('debería inicializarse el servicio con éxito', () => {
    expect(service).toBeTruthy();
  });

  describe('CRUD de Jugadores', () => {
    it('debería obtener la lista de jugadores aplicando parámetros de filtrado', () => {
      const mockFilters = { team: 'Real Madrid' };
      const mockResponse = [{ name: 'Modric' }];

      service.getPlayers(mockFilters).subscribe((players) => {
        expect(players).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url === baseUrl && r.params.has('team'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('team')).toBe('Real Madrid');
      req.flush(mockResponse);
    });

    it('debería inyectar el token síncrono en las cabeceras al crear un jugador', () => {
      localStorage.setItem('token', 'sync-local-token');
      const mockPlayer = { name: 'Guler' };

      service.createPlayer(mockPlayer).subscribe((res) => {
        expect(res).toBeTruthy();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer sync-local-token');
      req.flush({ success: true });
    });

    it('debería recuperar un jugador específico por su ID', () => {
      const id = 'player123';
      service.getPlayerById(id).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('debería inyectar el token en las cabeceras al actualizar un jugador', () => {
      sessionStorage.setItem('token', 'sync-session-token');
      const id = 'player123';

      service.updatePlayer(id, { name: ' Bellingham' }).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('Authorization')).toBe('Bearer sync-session-token');
      req.flush({});
    });

    it('debería usar el token asíncrono del AuthService al eliminar un jugador', (done) => {
      const id = 'player123';

      service.deletePlayer(id).subscribe(() => {
        expect(mockAuthService.getActiveToken).toHaveBeenCalled();
        done();
      });

      // Forzamos el paso de microtareas asíncronas internas del Promise de AuthService
      setTimeout(() => {
        const req = httpMock.expectOne(`${baseUrl}/${id}`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.headers.get('Authorization')).toBe('Bearer async-mock-token');
        req.flush({});
      }, 0);
    });
  });

  describe('Gestión de Comentarios', () => {
    it('debería obtener los comentarios de un jugador', () => {
      const id = 'p123';
      service.getComments(id).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}/comments`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('debería añadir un comentario sin requerir cabecera de autenticación explicita', () => {
      const id = 'p123';
      const comment = { text: 'Crack!', rating: 5 };
      service.addComment(id, comment).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}/comments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(comment);
      req.flush({});
    });

    it('debería inyectar el token asíncrono al eliminar un comentario', (done) => {
      const pId = 'p123';
      const cId = 'c789';

      service.deleteComment(pId, cId).subscribe(() => {
        done();
      });

      setTimeout(() => {
        const req = httpMock.expectOne(`${baseUrl}/${pId}/comments/${cId}`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.headers.get('Authorization')).toBe('Bearer async-mock-token');
        req.flush({});
      }, 0);
    });
  });

  describe('Módulos Externos e Inteligencia Artificial', () => {
    it('debería buscar jugadores externos mediante parámetros query', () => {
      const params = { search: 'Haaland', league: 'ENG_1' };
      service.searchExternalPlayer(params).subscribe();

      const req = httpMock.expectOne((r) => r.url === `${externalUrl}/search-player`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('search')).toBe('Haaland');
      req.flush({});
    });

    it('debería enviar el payload de importación masiva por POST', () => {
      const payload = { players: [], latitude: 40.41, longitude: -3.70 };
      service.importPlayers(payload).subscribe();

      const req = httpMock.expectOne(`${externalUrl}/import`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush({});
    });

    it('debería adjuntar el token asíncrono para consumir la generación de equipo ideal', (done) => {
      service.getEquipoIdeal().subscribe(() => {
        done();
      });

      setTimeout(() => {
        const req = httpMock.expectOne(`${externalUrl}/equipo-ideal`);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Authorization')).toBe('Bearer async-mock-token');
        req.flush({});
      }, 0);
    });
  });
});