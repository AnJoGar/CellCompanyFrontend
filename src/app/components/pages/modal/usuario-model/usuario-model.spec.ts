import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioModel } from './usuario-model';

describe('UsuarioModel', () => {
  let component: UsuarioModel;
  let fixture: ComponentFixture<UsuarioModel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioModel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioModel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
