import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioNaoAutenticadoComponent } from './usuario-nao-autenticado.component';

describe('UsuarioNaoAutenticadoComponent', () => {
  let component: UsuarioNaoAutenticadoComponent;
  let fixture: ComponentFixture<UsuarioNaoAutenticadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioNaoAutenticadoComponent]
    });
    fixture = TestBed.createComponent(UsuarioNaoAutenticadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
