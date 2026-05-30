import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPage } from './landing.page';
import { Router } from '@angular/router';

describe('LandingPage (Pruebas Unitarias)', () => {
  let component: LandingPage;
  let fixture: ComponentFixture<LandingPage>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [LandingPage],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPage);
    component = fixture.componentInstance;
  });

  it('debería inicializarse el componente con éxito', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Ciclos de vida y limpieza de almacenamiento', () => {
    beforeEach(() => {
      spyOn(localStorage, 'clear');
    });

    it('debería vaciar el localStorage por completo al ejecutar ngOnInit', () => {
      component.ngOnInit();
      expect(localStorage.clear).toHaveBeenCalled();
    });

    it('debería vaciar el localStorage por completo al ejecutar ionViewWillEnter (evento de ciclo de Ionic)', () => {
      component.ionViewWillEnter();
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('Navegación', () => {
    it('debería redirigir hacia la pantalla de registro al ejecutar goToRegister', () => {
      component.goToRegister();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('debería redirigir hacia el listado público o general de jugadores al ejecutar goToList', () => {
      component.goToList();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-list']);
    });
  });
});