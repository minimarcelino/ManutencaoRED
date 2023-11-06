import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarRedComponent } from './listar.component';

describe('ListarComponent', () => {
  let component: ListarRedComponent;
  let fixture: ComponentFixture<ListarRedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarRedComponent]
    });
    fixture = TestBed.createComponent(ListarRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
