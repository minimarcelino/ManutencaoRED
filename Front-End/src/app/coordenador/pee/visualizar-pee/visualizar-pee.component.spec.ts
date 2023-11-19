import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPeeComponent } from './visualizar-pee.component';

describe('VisualizarPeeComponent', () => {
  let component: VisualizarPeeComponent;
  let fixture: ComponentFixture<VisualizarPeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarPeeComponent]
    });
    fixture = TestBed.createComponent(VisualizarPeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
