import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCursoComponent } from './editar.component';

describe('EditarComponent', () => {
  let component: EditarCursoComponent;
  let fixture: ComponentFixture<EditarCursoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCursoComponent]
    });
    fixture = TestBed.createComponent(EditarCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
