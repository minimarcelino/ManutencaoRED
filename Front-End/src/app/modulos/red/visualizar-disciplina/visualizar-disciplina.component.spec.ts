import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarDisciplinaComponent } from './visualizar-disciplina.component';

describe('VisualizarDisciplinaComponent', () => {
  let component: VisualizarDisciplinaComponent;
  let fixture: ComponentFixture<VisualizarDisciplinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarDisciplinaComponent]
    });
    fixture = TestBed.createComponent(VisualizarDisciplinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
