import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrientacaoPedagogicaComponent } from './dialog-orientacao-pedagogica.component';

describe('DialogOrientacaoPedagogicaComponent', () => {
  let component: DialogOrientacaoPedagogicaComponent;
  let fixture: ComponentFixture<DialogOrientacaoPedagogicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogOrientacaoPedagogicaComponent]
    });
    fixture = TestBed.createComponent(DialogOrientacaoPedagogicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
