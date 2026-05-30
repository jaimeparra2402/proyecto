import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PlayerDetailPage } from './player-detail.page';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

describe('PlayerDetailPage (Pruebas Unitarias)', () => {
  let component: PlayerDetailPage;
  let fixture: ComponentFixture<PlayerDetailPage>;

  let mockPlayerService: any;
  let mockPlayerFactory: any;
  let mockAuthService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockPlayerService = {
      getPlayerById: jasmine.createSpy('getPlayerById').and.returnValue(of({
        id: '10',
        name: 'Kylian Mbappé',
        team: 'Real Madrid',
        comments: [
          { _id: 'c1', author: 'Juan', text: 'Buen jugador', rating: 5 }
        ]
      })),
      addComment: jasmine.createSpy('addComment').and.returnValue(of({ success: true })),
      deleteComment: jasmine.createSpy('deleteComment').and.returnValue(of({ success: true })),
      deletePlayer: jasmine.createSpy('deletePlayer').and.returnValue(of({ success: true }))
    };

    mockPlayerFactory = {
      getService: jasmine.createSpy('getService').and.returnValue(mockPlayerService)
    };

    mockAuthService = {
      currentUser: jasmine.createSpy('currentUser').and.returnValue({ email: 'admin@test.com' }),
      isUserAdmin: jasmine.createSpy('isUserAdmin').and.returnValue(true)
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('10')
        }
      }
    };

    // Espía global para la geolocalización de Capacitor
    spyOn(Geolocation, 'getCurrentPosition').and.returnValue(
      Promise.resolve({
        coords: { latitude: 41.3851, longitude: 2.1734 }
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [PlayerDetailPage],
      providers: [
        { provide: PlayerFactoryService, useValue: mockPlayerFactory },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerDetailPage);
    component = fixture.componentInstance;
  });

  it('debería inicializar y cargar los detalles del jugador con sus comentarios', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(component.playerId).toBe('10');
    expect(mockPlayerService.getPlayerById).toHaveBeenCalledWith('10');
    expect(component.player.name).toBe('Kylian Mbappé');
    expect(component.comments.length).toBe(1);
    expect(component.comments[0].author).toBe('Juan');
  });

  it('debería redirigir a /home si no se encuentra el ID en la ruta', () => {
    spyOn(console, 'error');
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  describe('Envío de comentarios (sendComment)', () => {
    it('no debería enviar el comentario si el texto está vacío', fakeAsync(() => {
      fixture.detectChanges();
      component.commentText = '   ';

      component.sendComment();
      tick();

      expect(mockPlayerService.addComment).not.toHaveBeenCalled();
    }));

    it('debería añadir un comentario con geolocalización real y reiniciar el formulario', fakeAsync(() => {
      fixture.detectChanges();
      component.author = 'Carlos ';
      component.commentText = 'Espectacular partido';
      component.rating = 4;

      component.sendComment();
      tick(); // Resuelve el Promise de Geolocation e hilos asíncronos

      expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
      expect(mockPlayerService.addComment).toHaveBeenCalledWith('10', jasmine.objectContaining({
        author: 'Carlos',
        text: 'Espectacular partido',
        rating: 4,
        latitude: 41.3851,
        longitude: 2.1734
      }));
      
      // Verifica la limpieza de campos tras el éxito
      expect(component.commentText).toBe('');
      expect(component.author).toBe('');
      expect(component.rating).toBe(5);
    }));

    it('debería usar coordenadas por defecto si la geolocalización falla o es rechazada', fakeAsync(() => {
      (Geolocation.getCurrentPosition as jasmine.Spy).and.returnValue(Promise.reject('GPS Desactivado'));
      fixture.detectChanges();
      
      component.commentText = 'Comentario sin GPS';
      component.sendComment();
      tick();

      expect(mockPlayerService.addComment).toHaveBeenCalledWith('10', jasmine.objectContaining({
        text: 'Comentario sin GPS',
        latitude: 40.416775,
        longitude: -3.703790
      }));
    }));
  });

  describe('Eliminación y Gestión', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería llamar al servicio para eliminar un comentario y recargar los detalles', () => {
      mockPlayerService.getPlayerById.calls.reset(); // Reseteamos contador de llamadas

      component.removeComment('c1');

      expect(mockPlayerService.deleteComment).toHaveBeenCalledWith('10', 'c1');
      expect(mockPlayerService.getPlayerById).toHaveBeenCalled();
    });

    it('debería navegar a la ruta de edición al ejecutar editPlayer', () => {
      component.editPlayer();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/edit-player', '10']);
    });

    it('debería borrar al jugador del sistema y redirigir a la home', () => {
      component.deletePlayer();

      expect(mockPlayerService.deletePlayer).toHaveBeenCalledWith('10');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });
  });
});