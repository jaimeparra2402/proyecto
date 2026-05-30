import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ListComponent (Pruebas Unitarias)', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería calcular el array de estrellas correctamente en base al rating', () => {
    const stars = component.getStars(4.5);
    expect(stars.length).toBe(4);
    expect(stars).toEqual([0, 0, 0, 0]);
  });

  it('debería devolver un array vacío si el rating es inválido', () => {
    const stars = component.getStars('no-soy-un-numero');
    expect(stars.length).toBe(0);
  });

  it('debería emitir el evento onSelect al seleccionar un ítem', () => {
    spyOn(component.onSelect, 'emit');
    const mockItem = { name: 'Messi', team: 'Inter Miami' };
    
    component.selectItem(mockItem);
    
    expect(component.onSelect.emit).toHaveBeenCalledWith(mockItem);
  });
});