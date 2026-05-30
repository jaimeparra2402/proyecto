import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JavaPlayerService } from './java-player.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('JavaPlayerService (Pruebas Unitarias)', () => {
  let service: JavaPlayerService;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const baseUrl = `${environment.apiJava}/players`;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getActiveToken']);
    // Configuramos el token asíncrono por defecto para los métodos reactivos con switchMap
    mockAuthService.getActiveToken.and.returnValue(Promise.resolve('async-java-token'));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JavaPlayerService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(JavaPlayerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no queden peticiones HTTP colgadas o sin responder
  });

  it('debería inicializarse el servicio con éxito', () => {
    expect(service).toBeTruthy();
  });

  describe('CRUD de Jugadores (Java Endpoints)', () => {
    it('debería obtener la lista de jugadores con filtros opcionales en la URL', () => {
      const mockFilters = { league: 'LaLiga' };
      const mockResponse = [{ name: 'Vinicius Jr' }];

      service.getPlayers(mockFilters).subscribe((players) => {
        expect(players).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url === baseUrl && r.params.has('league'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('league')).toBe('LaLiga');
      req.flush(mockResponse);
    });

    it('debería recuperar un jugador específico por su ID único', () => {
      const id = 'java_10';
      service.getPlayerById(id).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('debería enviar una petición POST para la creación de un jugador sin cabeceras extra', () => {
      const mockPlayer = { name: 'Vitor Roque', team: 'Betis' };
      service.createPlayer(mockPlayer).subscribe();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPlayer);
      req.flush({});
    });

    it('debería enviar una petición PUT para la actualización de un jugador', () => {
      const id = 'java_10';
      const updateData = { name: 'Vini', team: 'Real Madrid' };
      service.updatePlayer(id, updateData).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush({});
    });

    it('debería resolver el token del AuthService asíncronamente y meterlo en la cabecera al borrar un jugador', (done) => {
      const id = 'java_10';

      service.deletePlayer(id).subscribe(() => {
        expect(mockAuthService.getActiveToken).toHaveBeenCalled();
        done();
      });

      // Forzamos el salto de microtareas asíncronas para dar tiempo al Promise a resolverse
      setTimeout(() => {
        const req = httpMock.expectOne(`${baseUrl}/${id}`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.headers.get('Authorization')).toBe('Bearer async-java-token');
        req.flush({});
      }, 0);
    });
  });

  describe('Gestión de Comentarios (Java Endpoints)', () => {
    it('debería obtener los comentarios vinculados a un jugador', () => {
      const id = 'java_20';
      service.getComments(id).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}/comments`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('debería guardar un nuevo comentario mediante POST', () => {
      const id = 'java_20';
      const commentPayload = { author: 'Pepe', text: 'Top player', rating: 5 };
      service.addComment(id, commentPayload).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/${id}/comments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(commentPayload);
      req.flush({});
    });

    it('debería resolver el token asíncronamente y agregarlo a las cabeceras al borrar un comentario', (done) => {
      const pId = 'java_20';
      const cId = 'comment_99';

      service.deleteComment(pId, cId).subscribe(() => {
        done();
      });

      setTimeout(() => {
        const req = httpMock.expectOne(`${baseUrl}/${pId}/comments/${cId}`);
        expect(req.request.method).toBe('DELETE');
        expect(req.request.headers.get('Authorization')).toBe('Bearer async-java-token');
        req.flush({});
      }, 0);
    });
  });

  describe('Módulos Externos e Inteligencia Artificial (Java Endpoints)', () => {
    it('debería buscar jugadores externos en la subruta /external/search-player', () => {
      const query = { search: 'Neymar' };
      service.searchExternalPlayer(query).subscribe();

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/external/search-player`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('search')).toBe('Neymar');
      req.flush({});
    });

    it('debería procesar la importación masiva en la subruta /external/import', () => {
      const importData = { players: [], latitude: 40.0, longitude: -3.0 };
      service.importPlayers(importData).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/external/import`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(importData);
      req.flush({});
    });

    it('debería consumir el endpoint de IA para el equipo ideal sin obligar a usar cabeceras de token en Java', () => {
      service.getEquipoIdeal().subscribe();

      const req = httpMock.expectOne(`${baseUrl}/external/equipo-ideal`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });
});