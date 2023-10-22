import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRAComponent } from './cra.component';

describe('CRAComponent', () => {
  let component: CRAComponent;
  let fixture: ComponentFixture<CRAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CRAComponent]
    });
    fixture = TestBed.createComponent(CRAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
