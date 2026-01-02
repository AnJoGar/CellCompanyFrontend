import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerHistorial } from './modal-ver-historial';

describe('ModalVerHistorial', () => {
  let component: ModalVerHistorial;
  let fixture: ComponentFixture<ModalVerHistorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalVerHistorial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerHistorial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
