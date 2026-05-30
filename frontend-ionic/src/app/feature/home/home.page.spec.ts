import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomePage } from './home.page';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

describe('HomePage (Pruebas Unitarias)', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockAuthService = {
      currentUser: jasmine.createSpy('currentUser').and.returnValue({ email: 'jaime.test@correo.com' }),
      logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve())
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('debería inicializarse el componente correctamente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('getUsername()', () => {
    it('debería capitalizar y formatear el nombre antes de la arroba si hay email', () => {
      fixture.detectChanges();
      const username = component.getUsername();
      expect(username).toBe('Jaime.test');
    });

    it('debería devolver "Usuario" si no hay sesión activa o no existe el email', () => {
      mockAuthService.currentUser.and.returnValue(null);
      fixture.detectChanges();
      
      const username = component.getUsername();
      expect(username).toBe('Usuario');
    });
  });

  describe('Navegación por el menú', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('debería navegar a /import-api al ejecutar goToImportApi', () => {
      component.goToImportApi();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/import-api']);
    });

    it('debería navegar a /add-player al ejecutar goToAddPlayerForm', () => {
      component.goToAddPlayerForm();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-player']);
    });

    it('debería navegar a /ideal-team al ejecutar goToIdealTeam', () => {
      component.goToIdealTeam();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/ideal-team']);
    });

    it('debería navegar a /view-news-corba al ejecutar goToViewNews', () => {
      component.goToViewNews();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/view-news-corba']);
    });

    it('debería navegar a /player-list al ejecutar goToPlayerList', () => {
      component.goToPlayerList();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-list']);
    });

    it('debería navegar a /player-search al ejecutar goToSearchPlayers', () => {
      component.goToSearchPlayers();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-search']);
    });
  });

  describe('logout()', () => {
    it('debería llamar al servicio de autenticación, borrar el token y redirigir a /landing', fakeAsync(() => {
      spyOn(localStorage, 'removeItem');
      fixture.detectChanges();

      component.logout();
      tick();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/landing']);
    }));
  });
});