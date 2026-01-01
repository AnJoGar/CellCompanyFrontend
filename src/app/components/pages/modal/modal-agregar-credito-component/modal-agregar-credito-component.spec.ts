import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarCreditoComponent } from './modal-agregar-credito-component';

describe('ModalAgregarCreditoComponent', () => {
  let component: ModalAgregarCreditoComponent;
  let fixture: ComponentFixture<ModalAgregarCreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarCreditoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
