import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IdealTeamPage } from './ideal-team.page';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { of, throwError } from 'rxjs';

describe('IdealTeamPage (Pruebas Unitarias)', () => {
  let component: IdealTeamPage;
  let fixture: ComponentFixture<IdealTeamPage>;
  
  let mockPlayerService: any;
  let mockPlayerFactory: any;

  beforeEach(async () => {
    mockPlayerService = {
      getPlayers: jasmine.createSpy('getPlayers').and.returnValue(of([
        { name: 'Courtois', position: 'GK' },
        { name: 'Carvajal', position: 'DF' }
      ])),
      getEquipoIdeal: jasmine.createSpy('getEquipoIdeal').and.returnValue(of({
        tactics: '4-3-3',
        alignment: ['Courtois', 'Carvajal'],
        justification: 'Equipo equilibrado basado en estadísticas locales.'
      }))
    };

    mockPlayerFactory = {
      getService: jasmine.createSpy('getService').and.returnValue(mockPlayerService)
    };

    await TestBed.configureTestingModule({
      imports: [IdealTeamPage],
      providers: [
        { provide: PlayerFactoryService, useValue: mockPlayerFactory }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IdealTeamPage);
    component = fixture.componentInstance;
  });

  it('debería inicializarse el componente y cargar los jugadores disponibles', () => {
    fixture.detectChanges(); // Ejecuta ngOnInit

    expect(component).toBeTruthy();
    expect(mockPlayerFactory.getService).toHaveBeenCalled();
    expect(mockPlayerService.getPlayers).toHaveBeenCalled();
    expect(component.players.length).toBe(2);
  });

  it('debería mapear correctamente la lista de jugadores si la respuesta viene anidada en data.players', () => {
    mockPlayerService.getPlayers.and.returnValue(of({
      data: {
        players: [{ name: 'Mbappé', position: 'FW' }]
      }
    }));

    fixture.detectChanges();

    expect(component.players.length).toBe(1);
    expect(component.players[0].name).toBe('Mbappé');
  });

  it('debería mostrar un mensaje de error si se intenta generar el equipo ideal sin jugadores locales', () => {
    component.players = []; // Forzamos lista vacía
    component.generateDreamTeam();

    expect(component.errorMessage).toBe('Inserta algunos jugadores en la base de datos local primero para que el sistema pueda evaluar y confeccionar el equipo ideal.');
    expect(component.aiResponse).toBeNull();
    expect(mockPlayerService.getEquipoIdeal).not.toHaveBeenCalled();
  });

  it('debería gestionar los estados de carga y asignar la respuesta de la IA al completar con éxito', fakeAsync(() => {
    fixture.detectChanges(); // Carga los 2 jugadores iniciales mockup
    
    component.generateDreamTeam();

    expect(component.loading).toBeTrue();
    expect(component.errorMessage).toBe('');
    expect(component.aiResponse).toBeNull();

    tick(); // Resuelve la suscripción asíncrona

    expect(component.loading).toBeFalse();
    expect(component.aiResponse).toEqual({
      tactics: '4-3-3',
      alignment: ['Courtois', 'Carvajal'],
      justification: 'Equipo equilibrado basado en estadísticas locales.'
    });
  }));

  it('debería controlar el flujo de error si el servicio de IA del backend falla', fakeAsync(() => {
    spyOn(console, 'error');
    mockPlayerService.getEquipoIdeal.and.returnValue(throwError(() => new Error('AI Timeout')));
    fixture.detectChanges();

    component.generateDreamTeam();
    tick();

    expect(component.loading).toBeFalse();
    expect(component.aiResponse).toBeNull();
    expect(component.errorMessage).toBe('Ocurrió un error al conectar con el servicio de IA del backend.');
    expect(console.error).toHaveBeenCalled();
  }));
});