import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrasladoProductoComponent } from './modal-traslado-producto-component';

describe('ModalTrasladoProductoComponent', () => {
  let component: ModalTrasladoProductoComponent;
  let fixture: ComponentFixture<ModalTrasladoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTrasladoProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTrasladoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
