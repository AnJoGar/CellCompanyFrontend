import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerUsuario } from './modal-ver-usuario';

describe('ModalVerUsuario', () => {
  let component: ModalVerUsuario;
  let fixture: ComponentFixture<ModalVerUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVerUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
