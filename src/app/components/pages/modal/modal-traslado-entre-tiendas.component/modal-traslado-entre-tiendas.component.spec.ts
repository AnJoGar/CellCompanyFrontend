import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrasladoEntreTiendasComponent } from './modal-traslado-entre-tiendas.component';

describe('ModalTrasladoEntreTiendasComponent', () => {
  let component: ModalTrasladoEntreTiendasComponent;
  let fixture: ComponentFixture<ModalTrasladoEntreTiendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTrasladoEntreTiendasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTrasladoEntreTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
