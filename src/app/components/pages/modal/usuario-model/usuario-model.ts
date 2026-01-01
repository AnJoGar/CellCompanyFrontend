
import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import {  MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VerificarCodigoModel } from '../verificar-codigo-model/verificar-codigo-model';


@Component({
  selector: 'app-usuario-model',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,MatProgressSpinnerModule],
  templateUrl: './usuario-model.html',
  styleUrl: './usuario-model.css',
})
export class UsuarioModel implements OnInit, AfterViewInit{
 formUsuario: FormGroup;
  hide: boolean = true;
  accion:string ="Agregar"
  accionBoton: string = "Guardar";
  listaRoles: Rol[] = [];
isLoading: boolean = false;
  constructor(
    private dialogoReferencia: MatDialogRef<UsuarioModel>,
    @Inject(MAT_DIALOG_DATA) public usuarioEditar: Usuario,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _rolServicio:  RolService,
    private _usuarioServicio: UsuarioService,
    private dialog: MatDialog 
  )
  {
    this.formUsuario = this.fb.group({
      nombreApellido: ['', Validators.required],
      correo: ['', Validators.required],
      id: [1],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    })
    if (this.usuarioEditar!=null) {
      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }
    this._rolServicio.getRoles().subscribe({
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
    if (this.usuarioEditar !=null) {
      this.formUsuario.patchValue({
        nombreApellido: this.usuarioEditar.nombreApellidos,
        correo: this.usuarioEditar.correo,
        id: this.usuarioEditar.rolAdminId,
        clave:this.usuarioEditar.clave,
        esActivo: this.usuarioEditar.esActivo.toString()
      })
    }
  }

  ngAfterViewInit() {   
  }
agregarEditarUsuario() {
    if (this.formUsuario.invalid) return; // Seguridad extra

    const _usuario: Usuario = {
      id: this.usuarioEditar == null ? 0 : this.usuarioEditar.id,
      nombreApellidos: this.formUsuario.value.nombreApellido,
      correo: this.formUsuario.value.correo,
      rolAdminId: 1,
      rolDescripcion: "",
      clave: this.formUsuario.value.clave,
      esActivo: parseInt(this.formUsuario.value.esActivo)
    };

    // !!! IMPORTANTE: Activar el cargando para que salga el spinner !!!
    this.isLoading = true;

    if (this.usuarioEditar == null) {
      // CASO: NUEVO USUARIO (ENVÍO DE CÓDIGO)
      this._usuarioServicio.guardarAdmin(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("Código de verificación enviado al correo", "Exito");
            
            // !!! AQUÍ ESTABA EL ERROR: DEBES LLAMAR A LA FUNCIÓN QUE ABRE EL MODAL !!!
            this.abrirModalVerificacion(_usuario);
            
          } else {
            this.mostrarAlerta(data.msg || "No se pudo registrar", "Error");
            this.isLoading = false; // Desactivar si falló
          }
        },
        error: (e) => {
          console.log("DETALLE DEL ERROR:", e);
          this.mostrarAlerta("Error de conexión con el servidor", "Error");
          this.isLoading = false;
        }
      });
    } else {
      // CASO: EDITAR USUARIO (DIRECTO)
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

 abrirModalVerificacion(usuario: Usuario) {
    const dialogRef = this.dialog.open(VerificarCodigoModel, {
      disableClose: true,
      width: '400px',
      data: { 
        correo: usuario.correo, 
        usuarioData: usuario // Pasamos los datos por si acaso, aunque C# ya los tiene en memoria
      }
    });

  dialogRef.afterClosed().subscribe((resultado: any) => {
      if (resultado === 'verificado') {
        // Si el usuario puso el código bien, cerramos este modal de registro con éxito
        this.dialogoReferencia.close('agregado');
      } else {
        this.isLoading = false; // Si cerró el modal sin verificar, permitimos reintentar
      }
    });
  }

}
