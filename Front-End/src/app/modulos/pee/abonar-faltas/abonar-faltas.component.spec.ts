import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonarFaltaComponent } from './abonar-faltas.component';

describe('AbonarFaltaComponent', () => {
  let component: AbonarFaltaComponent;
  let fixture: ComponentFixture<AbonarFaltaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbonarFaltaComponent]
    });
    fixture = TestBed.createComponent(AbonarFaltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
