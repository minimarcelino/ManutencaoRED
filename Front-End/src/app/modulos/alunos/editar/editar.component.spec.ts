import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAlunosComponent } from './editar.component';

describe('EditarComponent', () => {
  let component: EditarAlunosComponent;
  let fixture: ComponentFixture<EditarAlunosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarAlunosComponent]
    });
    fixture = TestBed.createComponent(EditarAlunosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
