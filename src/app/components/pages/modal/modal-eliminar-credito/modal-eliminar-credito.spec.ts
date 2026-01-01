import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarCredito } from './modal-eliminar-credito';

describe('ModalEliminarCredito', () => {
  let component: ModalEliminarCredito;
  let fixture: ComponentFixture<ModalEliminarCredito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarCredito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarCredito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
