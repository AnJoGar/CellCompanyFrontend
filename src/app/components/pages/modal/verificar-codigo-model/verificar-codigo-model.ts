import { Component, Inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../services/usuario';
@Component({
  selector: 'app-verificar-codigo-model',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: './verificar-codigo-model.html',
  styleUrl: './verificar-codigo-model.css',
})
export class VerificarCodigoModel {
 formCodigo: FormGroup;
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<VerificarCodigoModel>,
    @Inject(MAT_DIALOG_DATA) public data: { correo: string, usuarioData: any },
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _usuarioServicio: UsuarioService
  ) {
    this.formCodigo = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  verificarCodigo() {
  if (this.formCodigo.invalid) return;

  this.isLoading = true;

  // Solo enviamos lo que pide el objeto 'VerificationCode' en C#
  const request = {
    correo: this.data.correo,
    codigo: this.formCodigo.value.codigo
  };

  // Llamamos al endpoint de validación
  this._usuarioServicio.ValidarCodigoAdmin(request).subscribe({
    next: (data) => {
      if (data.status) {
        this._snackBar.open('¡Usuario creado con éxito en la base de datos!', 'Éxito', { duration: 3000 });
        this.dialogRef.close('verificado');
      } else {
        this._snackBar.open(data.msg || 'Código incorrecto', 'Error', { duration: 3000 });
        this.isLoading = false;
      }
    },
    error: (e) => {
      this._snackBar.open('Error de conexión con el servidor', 'Error', { duration: 3000 });
      this.isLoading = false;
    }
  });
}
}
