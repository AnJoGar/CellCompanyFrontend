import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTienda } from './modal-tienda';

describe('ModalTienda', () => {
  let component: ModalTienda;
  let fixture: ComponentFixture<ModalTienda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTienda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTienda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
