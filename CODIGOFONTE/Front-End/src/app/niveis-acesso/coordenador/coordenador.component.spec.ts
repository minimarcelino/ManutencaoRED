import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordenadorComponent } from './coordenador.component';

describe('CoordenadorComponent', () => {
  let component: CoordenadorComponent;
  let fixture: ComponentFixture<CoordenadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoordenadorComponent]
    });
    fixture = TestBed.createComponent(CoordenadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
