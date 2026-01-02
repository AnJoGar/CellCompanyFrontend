import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecerClaveModel } from './restablecer-clave-model';

describe('RestablecerClaveModel', () => {
  let component: RestablecerClaveModel;
  let fixture: ComponentFixture<RestablecerClaveModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestablecerClaveModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestablecerClaveModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
