import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from '../../../../interfaces/rol';
import { Usuario } from '../../../../interfaces/usuario';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService} from '../../../../services/usuario';
import { RolService } from '../../../../services/rolSservice';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-modal-usuario-sin-v',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './modal-usuario-sin-v.html',
  styleUrl: './modal-usuario-sin-v.css',
})
export class ModalUsuarioSinV implements OnInit, AfterViewInit {
  formUsuario: FormGroup;
  hide: boolean = true;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";
  listaRoles: Rol[] = [];
  isLoading: boolean = false;

  constructor(
    private dialogoReferencia: MatDialogRef<ModalUsuarioSinV>,
    @Inject(MAT_DIALOG_DATA) public usuarioEditar: Usuario,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService
  ) {
    this.formUsuario = this.fb.group({
      nombreApellido: ['', Validators.required],
      correo: ['', Validators.required],
      //id: ['', Validators.required],
    rolAdminId: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    })

    if (this.usuarioEditar != null) {
      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }

    this._rolServicio.getRolesAdmin().subscribe({
      next: (data) => {
        if (data.status) {
          this.listaRoles = data.value;
        }
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }

  ngOnInit(): void {
  this._rolServicio.getRolesAdmin().subscribe({
      next: (data) => {
        if (data.status) {
          this.listaRoles = data.value;

          // 3. ¡IMPORTANTE! Una vez que tenemos la lista, aplicamos los valores
          if (this.usuarioEditar != null) {
            this.formUsuario.patchValue({
              nombreApellido: this.usuarioEditar.nombreApellidos,
              correo: this.usuarioEditar.correo,
              // Convertimos a Number por si la API lo manda como string
              rolAdminId: Number(this.usuarioEditar.rolAdminId),
              clave: this.usuarioEditar.clave,
              esActivo: this.usuarioEditar.esActivo.toString()
            });
          }
        }
      },
      error: (e) => console.error("Error cargando roles", e)
    });
  }

  ngAfterViewInit() {
  }

  agregarEditarUsuario() {
    if (this.formUsuario.invalid) return;

    const _usuario: Usuario = {
      id: this.usuarioEditar == null ? 0 : this.usuarioEditar.id,
      nombreApellidos: this.formUsuario.value.nombreApellido,
      correo: this.formUsuario.value.correo,
     rolAdminId: this.formUsuario.value.rolAdminId, // Leemos el nuevo nombre
  rolDescripcion: "",
      clave: this.formUsuario.value.clave,
      esActivo: parseInt(this.formUsuario.value.esActivo)
    };

    this.isLoading = true;

    if (this.usuarioEditar == null) {
      // REGISTRO DIRECTO SIN VERIFICACIÓN
      this._usuarioServicio.GuardarUsuarioSinV(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("Usuario registrado correctamente", "Exito");
            this.dialogoReferencia.close('agregado');
          } else {
            this.mostrarAlerta(data.msg || "No se pudo registrar", "Error");
            this.isLoading = false;
          }
        },
        error: (e) => {
          console.log("DETALLE DEL ERROR:", e);
          this.mostrarAlerta("Error de conexión con el servidor", "Error");
          this.isLoading = false;
        }
      });
    } else {
      // EDITAR USUARIO
      this._usuarioServicio.EditarUsuario(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("El usuario fue editado", "Exito");
            this.dialogoReferencia.close('editado');
          } else {
            this.mostrarAlerta("No se pudo editar", "Error");
            this.isLoading = false;
          }
        },
        error: (e) => {
          this.mostrarAlerta("Error al editar usuario", "Error");
          this.isLoading = false;
        }
      });
    }
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
}