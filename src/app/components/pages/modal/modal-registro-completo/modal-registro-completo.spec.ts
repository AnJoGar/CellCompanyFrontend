import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegistroCompleto } from './modal-registro-completo';

describe('ModalRegistroCompleto', () => {
  let component: ModalRegistroCompleto;
  let fixture: ComponentFixture<ModalRegistroCompleto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRegistroCompleto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRegistroCompleto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
