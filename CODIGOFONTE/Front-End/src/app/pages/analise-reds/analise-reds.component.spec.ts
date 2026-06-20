import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseRedsComponent } from './analise-reds.component';

describe('AnaliseRedsComponent', () => {
  let component: AnaliseRedsComponent;
  let fixture: ComponentFixture<AnaliseRedsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnaliseRedsComponent]
    });
    fixture = TestBed.createComponent(AnaliseRedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
