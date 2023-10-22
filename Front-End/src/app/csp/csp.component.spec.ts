import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CSPComponent } from './csp.component';

describe('CSPComponent', () => {
  let component: CSPComponent;
  let fixture: ComponentFixture<CSPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CSPComponent]
    });
    fixture = TestBed.createComponent(CSPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
