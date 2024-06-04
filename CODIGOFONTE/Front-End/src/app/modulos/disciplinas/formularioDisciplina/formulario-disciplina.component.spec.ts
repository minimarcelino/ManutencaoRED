import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarComponent } from './formulario-disciplina.component';

describe('CadastrarComponent', () => {
  let component: CadastrarComponent;
  let fixture: ComponentFixture<CadastrarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarComponent]
    });
    fixture = TestBed.createComponent(CadastrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
