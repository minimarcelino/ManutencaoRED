import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioRedComponent } from './relatorio-red.component';

describe('RelatorioRedComponent', () => {
  let component: RelatorioRedComponent;
  let fixture: ComponentFixture<RelatorioRedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioRedComponent]
    });
    fixture = TestBed.createComponent(RelatorioRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
