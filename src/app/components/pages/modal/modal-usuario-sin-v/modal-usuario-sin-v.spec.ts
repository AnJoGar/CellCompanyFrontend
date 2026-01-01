import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUsuarioSinV } from './modal-usuario-sin-v';

describe('ModalUsuarioSinV', () => {
  let component: ModalUsuarioSinV;
  let fixture: ComponentFixture<ModalUsuarioSinV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUsuarioSinV]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUsuarioSinV);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
