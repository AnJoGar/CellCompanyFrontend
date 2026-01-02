import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProducto } from './modal-producto';

describe('ModalProducto', () => {
  let component: ModalProducto;
  let fixture: ComponentFixture<ModalProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
