import { TestBed } from '@angular/core/testing';
import { PlayerFactoryService } from './player-factory.service';
import { BackendToggleService } from './backend-toggle.service';
import { NodePlayerService } from './node-player.service';
import { JavaPlayerService } from './java-player.service';

describe('PlayerFactoryService (Pruebas Unitarias)', () => {
  let factoryService: PlayerFactoryService;
  
  // Mocks de los servicios dependientes
  let mockToggleService: jasmine.SpyObj<BackendToggleService>;
  let mockNodeService: jasmine.SpyObj<NodePlayerService>;
  let mockJavaService: jasmine.SpyObj<JavaPlayerService>;

  beforeEach(() => {
    // Creamos espías para aislar las dependencias del Factory
    mockToggleService = jasmine.createSpyObj('BackendToggleService', ['getBackend']);
    mockNodeService = jasmine.createSpyObj('NodePlayerService', ['getPlayers']);
    mockJavaService = jasmine.createSpyObj('JavaPlayerService', ['getPlayers']);

    TestBed.configureTestingModule({
      providers: [
        PlayerFactoryService,
        { provide: BackendToggleService, useValue: mockToggleService },
        { provide: NodePlayerService, useValue: mockNodeService },
        { provide: JavaPlayerService, useValue: mockJavaService }
      ]
    });

    factoryService = TestBed.inject(PlayerFactoryService);
  });

  it('debería inicializarse el servicio de la factoría con éxito', () => {
    expect(factoryService).toBeTruthy();
  });

  it('debería retornar la instancia de NodePlayerService si el backend activo es NODE', () => {
    // Simulamos que el interruptor del backend devuelve 'NODE'
    mockToggleService.getBackend.and.returnValue('NODE');

    const service = factoryService.getService();

    expect(mockToggleService.getBackend).toHaveBeenCalled();
    expect(service).toBe(mockNodeService);
    expect(service).not.toBe(mockJavaService);
  });

  it('debería retornar la instancia de JavaPlayerService si el backend activo es JAVA', () => {
    // Simulamos que el interruptor del backend devuelve 'JAVA'
    mockToggleService.getBackend.and.returnValue('JAVA');

    const service = factoryService.getService();

    expect(mockToggleService.getBackend).toHaveBeenCalled();
    expect(service).toBe(mockJavaService);
    expect(service).not.toBe(mockNodeService);
  });
});