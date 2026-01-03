import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHistorialPagos } from './modal-historial-pagos';

describe('ModalHistorialPagos', () => {
  let component: ModalHistorialPagos;
  let fixture: ComponentFixture<ModalHistorialPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalHistorialPagos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalHistorialPagos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
