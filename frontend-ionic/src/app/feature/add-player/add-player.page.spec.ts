import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPlayerPage } from './add-player.page';

describe('AddPlayerPage', () => {
  let component: AddPlayerPage;
  let fixture: ComponentFixture<AddPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
