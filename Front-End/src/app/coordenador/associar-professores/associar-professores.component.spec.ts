import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociarProfessoresComponent } from './associar-professores.component';

describe('AssociarProfessoresComponent', () => {
  let component: AssociarProfessoresComponent;
  let fixture: ComponentFixture<AssociarProfessoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssociarProfessoresComponent]
    });
    fixture = TestBed.createComponent(AssociarProfessoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
