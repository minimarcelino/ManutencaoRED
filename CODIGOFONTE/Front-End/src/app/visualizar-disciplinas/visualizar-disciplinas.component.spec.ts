import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarDisciplinasComponent } from './visualizar-disciplinas.component';

describe('VisualizarDisciplinasComponent', () => {
  let component: VisualizarDisciplinasComponent;
  let fixture: ComponentFixture<VisualizarDisciplinasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarDisciplinasComponent]
    });
    fixture = TestBed.createComponent(VisualizarDisciplinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
