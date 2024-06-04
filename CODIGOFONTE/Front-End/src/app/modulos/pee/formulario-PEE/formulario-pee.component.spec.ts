import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPEEComponent } from './formulario-pee.component';

describe('CadastrarPeeComponent', () => {
  let component: FormularioPEEComponent;
  let fixture: ComponentFixture<FormularioPEEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioPEEComponent]
    });
    fixture = TestBed.createComponent(FormularioPEEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
