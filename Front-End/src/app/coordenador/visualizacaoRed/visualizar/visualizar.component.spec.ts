import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarREDsComponent } from './visualizar.component';

describe('VisualizarComponent', () => {
  let component: VisualizarREDsComponent;
  let fixture: ComponentFixture<VisualizarREDsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisualizarREDsComponent]
    });
    fixture = TestBed.createComponent(VisualizarREDsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
