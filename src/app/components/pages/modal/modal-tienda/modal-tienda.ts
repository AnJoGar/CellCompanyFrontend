import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { TiendaService } from '../../../../services/Tienda-Service';
import { Tienda } from '../../../../interfaces/Tienda';
@Component({
  selector: 'app-modal-tienda',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule],
  templateUrl: './modal-tienda.html',
  styleUrl: './modal-tienda.css',
})
export class ModalTienda  implements OnInit {
 formTienda: FormGroup;
  accion: string = 'Agregar';
  accionBoton: string = 'Guardar';
  isLoading: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ModalTienda>,
    @Inject(MAT_DIALOG_DATA) public tiendaEditar: Tienda | null,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _tiendaService: TiendaService
  ) {
    this.formTienda = this.fb.group({
      nombreTienda: ['', Validators.required],
      direccion: ['', Validators.required],
      nombreEncargado: ['', Validators.required],
      cedulaEncargado: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
       //id: ['', Validators.required],
      // fechaRegistro: ['', Validators.required]
    });

    if (this.tiendaEditar != null) {
      this.accion = 'Editar';
      this.accionBoton = 'Actualizar';
    }
  }

  ngOnInit(): void {
    if (this.tiendaEditar != null) {
      this.formTienda.patchValue({
        nombreTienda: this.tiendaEditar.nombreTienda,
        direccion: this.tiendaEditar.direccion,
        nombreEncargado: this.tiendaEditar.nombreEncargado,
        cedulaEncargado: this.tiendaEditar.cedulaEncargado,
        telefono: this.tiendaEditar.telefono
      });
    }
  }

  agregarEditarTienda() {
    if (this.formTienda.invalid) {
      this._snackBar.open('Por favor complete todos los campos correctamente', 'Error', {
        duration: 3000
      });
      return;
    }

    const tienda: Tienda = {
     id: this.tiendaEditar == null ? 0 : this.tiendaEditar.id,
      nombreTienda: this.formTienda.value.nombreTienda,
      direccion: this.formTienda.value.direccion,
      nombreEncargado: this.formTienda.value.nombreEncargado,
      cedulaEncargado: this.formTienda.value.cedulaEncargado,
      telefono: this.formTienda.value.telefono,
      fechaRegistro: this.tiendaEditar ? this.tiendaEditar.fechaRegistro : new Date()

    };

    this.isLoading = true;

    if (this.tiendaEditar == null) {
      // Crear nueva tienda
      this._tiendaService.crearTienda(tienda).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta('Tienda registrada correctamente', 'Éxito');
            this.dialogRef.close('agregado');
          } else {
            this.mostrarAlerta(data.msg || 'No se pudo registrar la tienda', 'Error');
            this.isLoading = false;
          }
        },
        error: (e) => {
          console.error('Error:', e);
          this.mostrarAlerta('Error de conexión con el servidor', 'Error');
          this.isLoading = false;
        }
      });
    } else {
      // Editar tienda
      this._tiendaService.editarTienda(tienda).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta('Tienda actualizada correctamente', 'Éxito');
            this.dialogRef.close('editado');
          } else {
            this.mostrarAlerta(data.msg || 'No se pudo actualizar', 'Error');
            this.isLoading = false;
          }
        },
        error: (e) => {
          console.error('Error:', e);
          this.mostrarAlerta('Error al actualizar', 'Error');
          this.isLoading = false;
        }
      });
    }
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }
}
