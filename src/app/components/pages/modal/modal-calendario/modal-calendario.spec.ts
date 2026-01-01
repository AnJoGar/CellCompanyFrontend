import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCalendario } from './modal-calendario';

describe('ModalCalendario', () => {
  let component: ModalCalendario;
  let fixture: ComponentFixture<ModalCalendario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCalendario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCalendario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
