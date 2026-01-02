import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarBodegaComponent } from './editar-bodega-component';

describe('EditarBodegaComponent', () => {
  let component: EditarBodegaComponent;
  let fixture: ComponentFixture<EditarBodegaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarBodegaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
