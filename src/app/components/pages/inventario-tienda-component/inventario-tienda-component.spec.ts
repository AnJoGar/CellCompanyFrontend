import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioTiendaComponent } from './inventario-tienda-component';

describe('InventarioTiendaComponent', () => {
  let component: InventarioTiendaComponent;
  let fixture: ComponentFixture<InventarioTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioTiendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
