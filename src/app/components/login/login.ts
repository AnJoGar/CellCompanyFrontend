import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario';
import { RolNavegacionService } from '../../services/rol-navegacion';
import { Login } from '../../interfaces/login';
import { UsuarioModel } from '../pages/modal/usuario-model/usuario-model';

// Angular Material
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  formLogin: FormGroup;
  ocultarPassword: boolean = true;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _rolNavegacion: RolNavegacionService,
    private cdr: ChangeDetectorRef
  ) {
    this.formLogin = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required]
    });
  }

iniciarSesion() {
  if (this.formLogin.invalid) return;

  this.isLoading = true;
  const request: Login = {
    correo: this.formLogin.value.correo,
    clave: this.formLogin.value.clave
  };

  this._usuarioServicio.ObtenerIniciarSesion(request).subscribe({
    next: (data) => {
      // 1. Apagamos el cargando SIEMPRE que recibimos respuesta
      this.isLoading = false; 

      if (data.status) {
        console.log("Login exitoso, guardando sesión...");
        this._rolNavegacion.guardarSesionUsuario(data.value);
        
        // 2. Navegamos. Asegúrate que 'pages' sea la ruta correcta
        this.router.navigate(['/pages']); 
      } else {
        this.mostrarAlerta("No se encontraron coincidencias", 'Error');
      }
      
      this.cdr.detectChanges();
    },
    error: (e) => {
      this.isLoading = false;
      console.error(e);
      this.mostrarAlerta("Hubo un error al iniciar sesión", 'Error');
      this.cdr.detectChanges();
    }
  });
}

  private mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, { duration: 3000 });
  }

  agregarUsuario() {
    this.dialog.open(UsuarioModel, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "agregado") {
        this._snackBar.open("Usuario registrado exitosamente", 'Éxito', { duration: 3000 });
      }
    });
  }
  private detenerCarga() {
    this.isLoading = false;
    this.cdr.detectChanges(); // <--- 5. Esto resuelve el error NG0100
  }
}