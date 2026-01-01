import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarCodigoModel } from './verificar-codigo-model';

describe('VerificarCodigoModel', () => {
  let component: VerificarCodigoModel;
  let fixture: ComponentFixture<VerificarCodigoModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarCodigoModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarCodigoModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
