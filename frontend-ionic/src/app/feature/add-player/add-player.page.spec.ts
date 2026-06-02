import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddPlayerPage } from './add-player.page';
import { PlayerFactoryService } from '../../core/services/player-factory.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

describe('AddPlayerPage (Pruebas Unitarias)', () => {
  let component: AddPlayerPage;
  let fixture: ComponentFixture<AddPlayerPage>;
  
  let mockPlayerService: any;
  let mockPlayerFactory: any;
  let mockRouter: any;

  // Creamos un mock limpio y tipado para simular el encadenamiento de métodos en Leaflet
  const mockLeafletChain: any = {
    setView: () => mockLeafletChain,
    addTo: () => mockLeafletChain
  };

  beforeEach(async () => {
    mockPlayerService = {
      createPlayer: jasmine.createSpy('createPlayer').and.returnValue(of({ id: '123' }))
    };

    mockPlayerFactory = {
      getService: jasmine.createSpy('getService').and.returnValue(mockPlayerService)
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    // Espías para las APIs nativas de Capacitor para evitar llamadas al hardware real
    spyOn(Geolocation, 'getCurrentPosition').and.returnValue(
      Promise.resolve({
        coords: { latitude: 41.3851, longitude: 2.1734 },
        timestamp: Date.now()
      } as any)
    );

    spyOn(Camera, 'getPhoto').and.returnValue(
      Promise.resolve({
        webPath: 'assets/mock-image.png'
      } as any)
    );

    // Evitamos problemas de renderizado de mapas manipulando Leaflet de forma segura
    spyOn(L, 'map').and.returnValue(mockLeafletChain);

    spyOn(L, 'tileLayer').and.returnValue({
      addTo: jasmine.createSpy('addTo').and.returnValue(mockLeafletChain)
    } as any);

    spyOn(L, 'marker').and.returnValue(mockLeafletChain);

    await TestBed.configureTestingModule({
      imports: [AddPlayerPage],
      providers: [
        { provide: PlayerFactoryService, useValue: mockPlayerFactory },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPlayerPage);
    component = fixture.componentInstance;
  });

  it('debería inicializar el componente con éxito', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('debería intentar obtener las coordenadas reales en ngOnInit', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(component.latitude).toBe(41.3851);
    expect(component.longitude).toBe(2.1734);
  }));

  it('debería usar coordenadas por defecto si falla la geolocalización', fakeAsync(() => {
    (Geolocation.getCurrentPosition as jasmine.Spy).and.returnValue(Promise.reject('Error de GPS'));
    
    fixture.detectChanges();
    tick();

    expect(component.latitude).toBe(40.416775);
    expect(component.longitude).toBe(-3.703790);
  }));

  it('debería asignar la ruta de la imagen al capturarla con la cámara', fakeAsync(() => {
    component.selectImageSource();
    tick();

    expect(Camera.getPhoto).toHaveBeenCalledWith({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
    expect(component.image).toBe('assets/mock-image.png');
  }));

  it('debería limpiar la propiedad image al ejecutar clearImage', () => {
    component.image = 'ruta/de/imagen.png';
    component.clearImage();
    expect(component.image).toBe('');
  });

  it('no debería guardar al jugador ni llamar al servicio si faltan campos obligatorios', () => {
    spyOn(window, 'alert');
    component.name = '';
    component.team = 'Real Madrid';

    component.savePlayer();

    expect(window.alert).toHaveBeenCalledWith('Por favor, rellena los campos obligatorios.');
    expect(mockPlayerService.createPlayer).not.toHaveBeenCalled();
  });

  it('debería llamar al servicio de creación y redirigir si el formulario es válido', () => {
    component.name = 'Cristiano Ronaldo';
    component.team = 'Al-Nassr';
    component.league = 'saudi_league';
    component.position = 'attacker';
    component.image = 'imagen_cr7.png';
    component.goals = 10;
    component.assists = 5;
    component.matchesPlayed = 15;

    component.savePlayer();

    expect(mockPlayerFactory.getService).toHaveBeenCalled();
    expect(mockPlayerService.createPlayer).toHaveBeenCalledWith({
      name: 'Cristiano Ronaldo',
      team: 'Al-Nassr',
      league: 'saudi_league',
      position: 'attacker',
      imageUrl: 'imagen_cr7.png',
      latitude: component.latitude,
      longitude: component.longitude,
      stats: { goals: 10, assists: 5, matchesPlayed: 15 }
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/player-list']);
  });

  it('debería manejar el error si la llamada del servicio falla', () => {
    spyOn(console, 'error');
    mockPlayerService.createPlayer.and.returnValue(throwError(() => new Error('Error de servidor')));
    
    component.name = 'Messi';
    component.team = 'Inter Miami';
    component.league = 'mls';
    component.position = 'attacker';

    component.savePlayer();

    expect(console.error).toHaveBeenCalledWith('Error al guardar el jugador:', jasmine.any(Error));
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});