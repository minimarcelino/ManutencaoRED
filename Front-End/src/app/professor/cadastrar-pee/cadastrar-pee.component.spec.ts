import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPeeComponent } from './cadastrar-pee.component';

describe('CadastrarPeeComponent', () => {
  let component: CadastrarPeeComponent;
  let fixture: ComponentFixture<CadastrarPeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarPeeComponent]
    });
    fixture = TestBed.createComponent(CadastrarPeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
