import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarPEEComponent } from './gerenciar-pee.component';

describe('PeeComponent', () => {
  let component: GerenciarPEEComponent;
  let fixture: ComponentFixture<GerenciarPEEComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GerenciarPEEComponent]
    });
    fixture = TestBed.createComponent(GerenciarPEEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
