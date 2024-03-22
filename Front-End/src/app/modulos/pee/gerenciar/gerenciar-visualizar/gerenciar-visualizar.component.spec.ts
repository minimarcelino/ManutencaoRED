import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarVisualizarPeeComponent } from './gerenciar-visualizar.component';

describe('VisualizarPeeComponent', () => {
  let component: GerenciarVisualizarPeeComponent;
  let fixture: ComponentFixture<GerenciarVisualizarPeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GerenciarVisualizarPeeComponent]
    });
    fixture = TestBed.createComponent(GerenciarVisualizarPeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
