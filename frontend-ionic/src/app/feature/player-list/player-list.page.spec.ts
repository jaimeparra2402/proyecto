import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlayerListPage } from './player-list.page';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('PlayerListPage (Pruebas Unitarias)', () => {
  let component: PlayerListPage;
  let fixture: ComponentFixture<PlayerListPage>;

  let mockPlayerService: any;
  let mockPlayerFactory: any;
  let mockAuthService: any;
  let mockRouter: any;

  const mockRawPlayers = [
    { _id: '1', name: 'Luka Modric', team: 'Real Madrid', image: 'modric.png' },
    { id: '2', name: 'Pedri', team: 'FC Barcelona', imageUrl: '' } // Probará el fallback de imagen
  ];

  beforeEach(async () => {
    mockPlayerService = {
      getPlayers: jasmine.createSpy('getPlayers').and.returnValue(of(mockRawPlayers)),
      deletePlayer: jasmine.createSpy('deletePlayer').and.returnValue(of({ success: true }))
    };

    mockPlayerFactory = {
      getService: jasmine.createSpy('getService').and.returnValue(mockPlayerService)
    };

    mockAuthService = {
      currentUser: jasmine.createSpy('currentUser').and.returnValue({ email: 'user@test.com' }),
      isUserAdmin: jasmine.createSpy('isUserAdmin').and.returnValue(false)
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [PlayerListPage],
      providers: [
        { provide: PlayerFactoryService, useValue: mockPlayerFactory },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerListPage);
    component = fixture.componentInstance;
  });

  it('debería inicializar el componente y cargar la lista mapeando las imágenes', () => {
    fixture.detectChanges(); // Ejecuta ngOnInit y loadPlayers()

    expect(component).toBeTruthy();
    expect(mockPlayerService.getPlayers).toHaveBeenCalledWith({});
    expect(component.players.length).toBe(2);
    
    // Comprobación de mapeos e imágenes por defecto
    expect(component.players[0].imageUrl).toBe('modric.png');
    expect(component.players[1].imageUrl).toBe('assets/placeholder-player.png');
  });

  it('debería construir y enviar los filtros de búsqueda correctamente', () => {
    fixture.detectChanges();
    mockPlayerService.getPlayers.calls.reset();

    component.searchName = '  Luka ';
    component.searchTeam = 'Madrid';
    component.searchDate = '2026-05-30';

    component.applyFilters();

    expect(mockPlayerService.getPlayers).toHaveBeenCalledWith({
      name: 'Luka',
      team: 'Madrid',
      desdeFecha: '2026-05-30'
    });
  });

  it('debería limpiar los inputs y reiniciar la lista al ejecutar clearFilters', () => {
    fixture.detectChanges();
    mockPlayerService.getPlayers.calls.reset();

    component.searchName = 'Pedri';
    component.searchTeam = 'Barca';
    component.searchDate = '2026-01-01';

    component.clearFilters();

    expect(component.searchName).toBe('');
    expect(component.searchTeam).toBe('');
    expect(component.searchDate).toBe('');
    expect(mockPlayerService.getPlayers).toHaveBeenCalledWith({});
  });

  describe('Navegación e Interacciones de Ítems', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería navegar a la página de detalle soportando identificadores tanto nativos como de MongoDB (_id / id)', () => {
      component.goToDetail({ _id: '1' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-detail', '1']);

      component.goToDetail({ id: '2' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-detail', '2']);
    });

    it('debería navegar a la página de edición con el ID del jugador al ejecutar onEditPlayer', () => {
      component.onEditPlayer({ _id: '1' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit-player', '1']);
    });

    it('debería eliminar el jugador y volver a refrescar la lista completa con éxito', () => {
      mockPlayerService.getPlayers.calls.reset();

      component.onDeletePlayer({ _id: '1' });

      expect(mockPlayerService.deletePlayer).toHaveBeenCalledWith('1');
      expect(mockPlayerService.getPlayers).toHaveBeenCalled();
    });

    it('debería manejar errores por consola si la petición de borrado falla', () => {
      spyOn(console, 'error');
      mockPlayerService.deletePlayer.and.returnValue(throwError(() => new Error('Forbidden')));

      component.onDeletePlayer({ _id: '1' });

      expect(console.error).toHaveBeenCalled();
    });
  });
});