import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComprobante } from './modal-comprobante';

describe('ModalComprobante', () => {
  let component: ModalComprobante;
  let fixture: ComponentFixture<ModalComprobante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComprobante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComprobante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
