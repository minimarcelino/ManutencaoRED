import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDisciplinasComponent } from './disciplinas.component';

describe('DisciplinasComponent', () => {
  let component: ListarDisciplinasComponent;
  let fixture: ComponentFixture<ListarDisciplinasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarDisciplinasComponent]
    });
    fixture = TestBed.createComponent(ListarDisciplinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
