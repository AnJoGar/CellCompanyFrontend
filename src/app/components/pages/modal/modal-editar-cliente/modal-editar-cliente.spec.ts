import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarCliente } from './modal-editar-cliente';

describe('ModalEditarCliente', () => {
  let component: ModalEditarCliente;
  let fixture: ComponentFixture<ModalEditarCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
