import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPago } from './modal-pago';

describe('ModalPago', () => {
  let component: ModalPago;
  let fixture: ComponentFixture<ModalPago>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPago]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPago);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
