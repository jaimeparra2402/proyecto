import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditPlayerPage } from './edit-player.page';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('EditPlayerPage (Pruebas Unitarias)', () => {
  let component: EditPlayerPage;
  let fixture: ComponentFixture<EditPlayerPage>;
  
  let mockPlayerService: any;
  let mockPlayerFactory: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockPlayerService = {
      getPlayerById: jasmine.createSpy('getPlayerById').and.returnValue(of({
        name: 'Lionel Messi',
        team: 'Inter Miami',
        league: 'MLS',
        position: 'FW',
        imageUrl: 'messi.png',
        latitude: 25.7617,
        longitude: -80.1918,
        stats: { goals: 12, assists: 8, matchesPlayed: 10 }
      })),
      updatePlayer: jasmine.createSpy('updatePlayer').and.returnValue(of({ success: true }))
    };

    mockPlayerFactory = {
      getService: jasmine.createSpy('getService').and.returnValue(mockPlayerService)
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('999')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EditPlayerPage],
      providers: [
        { provide: PlayerFactoryService, useValue: mockPlayerFactory },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPlayerPage);
    component = fixture.componentInstance;
  });

  it('debería inicializar el componente y cargar el jugador si hay ID', () => {
    fixture.detectChanges(); 
    
    expect(component).toBeTruthy();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(component.playerId).toBe('999');
    expect(mockPlayerService.getPlayerById).toHaveBeenCalledWith('999');
    expect(component.player.name).toBe('Lionel Messi');
  });

  it('debería redirigir a la lista si no se encuentra un ID en la ruta', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
    
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-list']);
    expect(mockPlayerService.getPlayerById).not.toHaveBeenCalled();
  });

  it('debería mapear correctamente la estructura de datos tanto si viene anidada como directa', () => {
    mockPlayerService.getPlayerById.and.returnValue(of({
      data: {
        player: {
          name: 'Neymar Jr',
          team: 'Al-Hilal',
          position: 'FW',
          stats: { goals: 1, assists: 2, matchesPlayed: 3 }
        }
      }
    }));

    fixture.detectChanges();

    expect(component.player.name).toBe('Neymar Jr');
    expect(component.player.team).toBe('Al-Hilal');
  });

  it('debería manejar el error de recuperación y redirigir a la lista de jugadores', () => {
    spyOn(console, 'error');
    mockPlayerService.getPlayerById.and.returnValue(throwError(() => new Error('Not Found')));

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-list']);
  });

  it('debería formatear de forma inteligente los strings de posición', () => {
    fixture.detectChanges();

    expect(component.formatPosition('GOALKEEPER')).toBe('GK');
    expect(component.formatPosition('POR')).toBe('GK');
    expect(component.formatPosition('DEFENDER')).toBe('DF');
    expect(component.formatPosition('MIDFIELDER')).toBe('MF');
    expect(component.formatPosition('ATTACKER')).toBe('FW');
    expect(component.formatPosition('DEL')).toBe('FW');
    expect(component.formatPosition('OTRA')).toBe('OTRA');
  });

  it('no debería lanzar la actualización si faltan campos obligatorios', () => {
    spyOn(window, 'alert');
    fixture.detectChanges();
    
    component.player.name = ''; // Vacío obligatorio

    component.submitUpdate();

    expect(window.alert).toHaveBeenCalledWith('Por favor, rellena todos los campos requeridos.');
    expect(mockPlayerService.updatePlayer).not.toHaveBeenCalled();
  });

  it('debería enviar los datos numéricos casteados y redirigir al detalle tras actualizar', () => {
    fixture.detectChanges();
    
    component.player.stats.goals = '15'; // Simulamos valor de un input de texto
    component.player.stats.assists = '10';

    component.submitUpdate();

    expect(mockPlayerService.updatePlayer).toHaveBeenCalledWith('999', {
      name: 'Lionel Messi',
      team: 'Inter Miami',
      league: 'MLS',
      position: 'FW',
      imageUrl: 'messi.png',
      latitude: 25.7617,
      longitude: -80.1918,
      stats: { goals: 15, assists: 10, matchesPlayed: 10 }
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-detail', '999']);
  });
});