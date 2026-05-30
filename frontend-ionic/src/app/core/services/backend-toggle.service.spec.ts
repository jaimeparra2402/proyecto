import { TestBed } from '@angular/core/testing';
import { BackendToggleService, BackendType } from './backend-toggle.service';

describe('BackendToggleService (Pruebas Unitarias)', () => {
  let service: BackendToggleService;

  beforeEach(() => {
    // Limpiamos el almacenamiento antes de cada prueba para evitar contaminación de estado
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [BackendToggleService]
    });
  });

  it('debería inicializarse con "NODE" por defecto si localStorage está vacío', () => {
    service = TestBed.inject(BackendToggleService);
    
    expect(service).toBeTruthy();
    expect(service.getBackend()).toBe('NODE');
  });

  it('debería inicializarse con el valor previamente guardado en localStorage', () => {
    localStorage.setItem('backend', 'JAVA');
    
    // Inyectamos el servicio después de haber modificado el localStorage
    service = TestBed.inject(BackendToggleService);

    expect(service.getBackend()).toBe('JAVA');
  });

  it('debería actualizar el estado del backend y guardarlo en localStorage al usar setBackend', () => {
    service = TestBed.inject(BackendToggleService);
    
    service.setBackend('JAVA');

    expect(service.getBackend()).toBe('JAVA');
    expect(localStorage.getItem('backend')).toBe('JAVA');

    service.setBackend('NODE');

    expect(service.getBackend()).toBe('NODE');
    expect(localStorage.getItem('backend')).toBe('NODE');
  });

  it('debería emitir de forma reactiva el nuevo backend a través del observable backend$', (done) => {
    service = TestBed.inject(BackendToggleService);
    const emisiones: BackendType[] = [];

    service.backend$.subscribe((backend) => {
      emisiones.push(backend);
      
      if (emisiones.length === 2) {
        expect(emisiones).toEqual(['NODE', 'JAVA']);
        done(); 
      }
    });

    service.setBackend('JAVA');
  });
});