import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Auth } from '@angular/fire/auth';
import { environment } from '../../../environments/environment';
import * as fireAuth from '@angular/fire/auth';

describe('AuthService (Pruebas Unitarias)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // Mocks de Firebase
  let mockAuth: any;
  let mockUserInstance: any;

  beforeEach(() => {
    // Inicializamos la estructura simulada del usuario de Firebase
    mockUserInstance = {
      uid: 'firebase_uid_123',
      email: 'test@gmail.com',
      getIdToken: jasmine.createSpy('getIdToken').and.returnValue(Promise.resolve('mock-firebase-token'))
    };

    mockAuth = {
      currentUser: mockUserInstance
    };

    // Espiamos los métodos exportados de @angular/fire/auth para evitar conexiones reales
    spyOn(fireAuth, 'user').and.returnValue(fireAuth.of(mockUserInstance) as any);
    spyOn(fireAuth, 'signInWithEmailAndPassword').and.returnValue(
      Promise.resolve({ user: mockUserInstance } as any)
    );
    spyOn(fireAuth, 'createUserWithEmailAndPassword').and.returnValue(
      Promise.resolve({ user: mockUserInstance } as any)
    );
    spyOn(fireAuth, 'signOut').and.returnValue(Promise.resolve());

    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Auth, useValue: mockAuth }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería inicializar el rol de administrador desde el localStorage en el constructor', () => {
    localStorage.setItem('userRole', 'admin');
    
    // Inyectamos el servicio después de setear el localStorage para que lo lea el constructor
    service = TestBed.inject(AuthService);

    expect(service.isUserAdmin()).toBeTrue();
    expect(service.isSystemAdmin()).toBeTrue();
  });

  it('debería inicializar como usuario normal si el localStorage está limpio', () => {
    service = TestBed.inject(AuthService);

    expect(service.isUserAdmin()).toBeFalse();
    expect(service.isSystemAdmin()).toBeFalse();
  });

  describe('Flujo de Login', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('debería iniciar sesión como Admin si el correo coincide', fakeAsync(() => {
      componentLogin('admin@gmail.com', 'admin123');

      expect(fireAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'admin@gmail.com', 'admin123');
      expect(service.isUserAdmin()).toBeTrue();
      expect(localStorage.getItem('userRole')).toBe('admin');
    }));

    it('debería iniciar sesión como usuario normal y limpiar rastros de admin si es otro correo', fakeAsync(() => {
      localStorage.setItem('userRole', 'admin'); // Forzamos estado previo sucio

      componentLogin('normal@gmail.com', 'user123');

      expect(service.isUserAdmin()).toBeFalse();
      expect(localStorage.getItem('userRole')).toBeNull();
    }));

    function componentLogin(email: string, pass: string) {
      let tokenResult: any;
      service.login(email, pass).then(token => tokenResult = token);
      tick();
      expect(tokenResult).toBe('mock-firebase-token');
    }
  });

  describe('Flujo de Registro (Firebase + Backend)', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('debería registrar en Firebase y luego impactar el POST en el backend con el Token de cabecera', fakeAsync(() => {
      let backendResponse: any;
      
      service.registerInFirebaseAndBackend('nuevo_usuario@gmail.com', 'passValid777')
        .then(res => backendResponse = res);

      tick(); // Resuelve la creación en Firebase y el IdToken

      // Interceptamos la llamada HTTP obligatoria al backend de Node
      const req = httpMock.expectOne(`${environment.apiNode}/users/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-firebase-token');
      expect(req.request.body).toEqual({
        username: 'nuevo_usuario',
        email: 'nuevo_usuario@gmail.com',
        password: 'passValid777',
        role: 'user'
      });

      req.flush({ success: true, dbId: 'node_id_99' });
      tick();

      expect(backendResponse).toEqual({ success: true, dbId: 'node_id_99' });
      expect(service.isUserAdmin()).toBeFalse();
    }));

    it('debería manejar el error del Backend sin romper el flujo, retornando la instancia de Firebase', fakeAsync(() => {
      spyOn(console, 'warn');
      let finalUser: any;

      service.registerInFirebaseAndBackend('error_back@gmail.com', 'pass123')
        .then(res => finalUser = res);

      tick();

      const req = httpMock.expectOne(`${environment.apiNode}/users/register`);
      req.error(new ErrorEvent('Network Error')); // Simulamos caída del backend
      tick();

      expect(console.warn).toHaveBeenCalled();
      expect(finalUser).toBe(mockUserInstance); 
    }));
  });

  describe('Métodos Auxiliares y Cierre de Sesión', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('debería retornar el Token activo si el usuario actual existe', async () => {
      const token = await service.getActiveToken();
      expect(token).toBe('mock-firebase-token');
    });

    it('debería retornar null en getActiveToken si no hay sesión en Firebase', async () => {
      mockAuth.currentUser = null;
      const token = await service.getActiveToken();
      expect(token).toBeNull();
    });

    it('debería obtener el UID del usuario actual con getUID', () => {
      expect(service.getUID()).toBe('firebase_uid_123');
    });

    it('debería limpiar estados, borrar el localStorage y desloguear al ejecutar logout', fakeAsync(() => {
      localStorage.setItem('userRole', 'admin');

      service.logout();
      tick();

      expect(fireAuth.signOut).toHaveBeenCalledWith(mockAuth);
      expect(localStorage.getItem('userRole')).toBeNull();
      expect(service.isUserAdmin()).toBeFalse();
    }));
  });
});