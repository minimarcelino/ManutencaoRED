import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociarDisciplinaComponent } from './associar-disciplina.component';

describe('AssociarDisciplinaComponent', () => {
  let component: AssociarDisciplinaComponent;
  let fixture: ComponentFixture<AssociarDisciplinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssociarDisciplinaComponent]
    });
    fixture = TestBed.createComponent(AssociarDisciplinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
