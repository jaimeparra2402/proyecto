import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlayerSearchPage } from './player-search.page';
import { NodePlayerService } from '../../core/services/node-player.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

describe('PlayerSearchPage (Pruebas Unitarias)', () => {
  let component: PlayerSearchPage;
  let fixture: ComponentFixture<PlayerSearchPage>;

  let mockNodePlayerService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockNodePlayerService = {
      searchExternalPlayer: jasmine.createSpy('searchExternalPlayer').and.returnValue(of({
        players: [{ name: 'Erling Haaland', team: 'Manchester City', position: 'FW' }]
      })),
      createPlayer: jasmine.createSpy('createPlayer').and.returnValue(of({ success: true }))
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    // Espía de Capacitor Geolocation para evitar llamadas de hardware reales
    spyOn(Geolocation, 'getCurrentPosition').and.returnValue(
      Promise.resolve({
        coords: { latitude: 53.4808, longitude: -2.2426 }
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [PlayerSearchPage],
      providers: [
        { provide: NodePlayerService, useValue: mockNodePlayerService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerSearchPage);
    component = fixture.componentInstance;
  });

  it('debería inicializar el componente correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Validación del formulario (formValid)', () => {
    it('debería retornar false si los campos están vacíos o el nombre tiene menos de 3 caracteres', () => {
      component.searchName = 'Ed';
      component.searchLeague = 'ENG_1';
      component.searchSeason = '2025';
      expect(component.formValid).toBeFalse();
    });

    it('debería retornar true si el nombre tiene 3 o más caracteres y la liga/temporada están seleccionadas', () => {
      component.searchName = 'Kovacic';
      component.searchLeague = 'ENG_1';
      component.searchSeason = '2025';
      expect(component.formValid).toBeTrue();
    });
  });

  describe('Control de Tokens (hasToken)', () => {
    beforeEach(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    it('debería retornar true si el token existe en localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('mock-token-local');
      expect(component.hasToken).toBeTrue();
    });

    it('debería retornar true si el token existe en sessionStorage', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue('mock-token-session');
      expect(component.hasToken).toBeTrue();
    });

    it('debería retornar false si no hay ningún token guardado', () => {
      expect(component.hasToken).toBeFalse();
    });
  });

  describe('Funcionalidad de Búsqueda (search)', () => {
    it('no debería ejecutar la búsqueda si el formulario es inválido', () => {
      component.searchName = 'Ab'; // Inválido
      component.search();
      expect(mockNodePlayerService.searchExternalPlayer).not.toHaveBeenCalled();
    });

    it('debería gestionar la carga y mapear los resultados al buscar con éxito', fakeAsync(() => {
      component.searchName = 'Haaland';
      component.searchLeague = 'ENG_1';
      component.searchSeason = '2025';

      component.search();

      expect(component.loading).toBeTrue();
      expect(component.searched).toBeTrue();

      tick(); // Resuelve la suscripción asíncrona de RxJS

      expect(component.loading).toBeFalse();
      expect(component.players.length).toBe(1);
      expect(component.players[0].name).toBe('Erling Haaland');
    }));

    it('debería desactivar el estado loading si el servicio responde con error', fakeAsync(() => {
      mockNodePlayerService.searchExternalPlayer.and.returnValue(throwError(() => new Error('API Error')));
      component.searchName = 'Haaland';
      component.searchLeague = 'ENG_1';
      component.searchSeason = '2025';

      component.search();
      tick();

      expect(component.loading).toBeFalse();
      expect(component.players.length).toBe(0);
    }));
  });

  describe('Importación de jugador (savePlayerToLocal)', () => {
    const mockExternalPlayer = {
      name: 'Erling Haaland',
      team: 'Manchester City',
      league: 'Premier League',
      position: 'FW',
      imageUrl: 'haaland.png',
      stats: { goals: 35, assists: 5, matchesPlayed: 30 }
    };

    it('debería capturar las coordenadas de geolocalización reales al importar y redirigir', fakeAsync(() => {
      component.savePlayerToLocal(mockExternalPlayer);
      tick(); // Resuelve la geolocalización de Capacitor

      expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(mockNodePlayerService.createPlayer).toHaveBeenCalledWith({
        name: 'Erling Haaland',
        team: 'Manchester City',
        league: 'Premier League',
        position: 'FW',
        imageUrl: 'haaland.png',
        latitude: 53.4808,
        longitude: -2.2426,
        stats: { goals: 35, assists: 5, matchesPlayed: 30 }
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-list']);
    }));

    it('debería utilizar las coordenadas por defecto si la geolocalización falla', fakeAsync(() => {
      (Geolocation.getCurrentPosition as jasmine.Spy).and.returnValue(Promise.reject('Permiso denegado'));

      component.savePlayerToLocal(mockExternalPlayer);
      tick();

      expect(mockNodePlayerService.createPlayer).toHaveBeenCalledWith(jasmine.objectContaining({
        latitude: 40.416775,
        longitude: -3.703790
      }));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-list']);
    }));
  });
});