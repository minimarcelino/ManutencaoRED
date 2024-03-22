import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPEEComponent } from './cadastrar-pee.component';

describe('CadastrarPeeComponent', () => {
  let component: CadastrarPEEComponent;
  let fixture: ComponentFixture<CadastrarPEEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarPEEComponent]
    });
    fixture = TestBed.createComponent(CadastrarPEEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
