import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioREDComponent } from './formulario-red.component';

describe('ProcessoREDComponent', () => {
  let component: FormularioREDComponent;
  let fixture: ComponentFixture<FormularioREDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioREDComponent]
    });
    fixture = TestBed.createComponent(FormularioREDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
