import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PEEAbonadosComponent } from './pees-abonados.component';

describe('PeesAbonadosComponent', () => {
  let component: PEEAbonadosComponent;
  let fixture: ComponentFixture<PEEAbonadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PEEAbonadosComponent]
    });
    fixture = TestBed.createComponent(PEEAbonadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
