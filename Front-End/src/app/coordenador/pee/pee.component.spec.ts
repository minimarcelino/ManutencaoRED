import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeeComponent } from './pee.component';

describe('PeeComponent', () => {
  let component: PeeComponent;
  let fixture: ComponentFixture<PeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeeComponent]
    });
    fixture = TestBed.createComponent(PeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
