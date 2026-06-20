import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesRedComponent } from './detalhes-red.component';

describe('DetalhesRedComponent', () => {
  let component: DetalhesRedComponent;
  let fixture: ComponentFixture<DetalhesRedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalhesRedComponent]
    });
    fixture = TestBed.createComponent(DetalhesRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
