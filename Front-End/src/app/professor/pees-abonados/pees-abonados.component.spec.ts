import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeesAbonadosComponent } from './pees-abonados.component';

describe('PeesAbonadosComponent', () => {
  let component: PeesAbonadosComponent;
  let fixture: ComponentFixture<PeesAbonadosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeesAbonadosComponent]
    });
    fixture = TestBed.createComponent(PeesAbonadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
