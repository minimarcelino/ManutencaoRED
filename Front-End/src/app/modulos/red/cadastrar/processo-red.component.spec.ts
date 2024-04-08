import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarProcessoREDComponent } from './processo-red.component';

describe('ProcessoREDComponent', () => {
  let component: CadastrarProcessoREDComponent;
  let fixture: ComponentFixture<CadastrarProcessoREDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarProcessoREDComponent]
    });
    fixture = TestBed.createComponent(CadastrarProcessoREDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
