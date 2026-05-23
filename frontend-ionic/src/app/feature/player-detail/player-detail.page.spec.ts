import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayerDetailPage } from './player-detail.page';

describe('PlayerDetailPage', () => {
  let component: PlayerDetailPage;
  let fixture: ComponentFixture<PlayerDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PlayerDetailPage, 
        RouterModule.forRoot([]), 
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});