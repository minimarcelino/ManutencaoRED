import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessoREDComponent } from './processo-red.component';

describe('ProcessoREDComponent', () => {
  let component: ProcessoREDComponent;
  let fixture: ComponentFixture<ProcessoREDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessoREDComponent]
    });
    fixture = TestBed.createComponent(ProcessoREDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
