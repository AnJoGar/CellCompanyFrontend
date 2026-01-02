
import { Component,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para el *ngIf
import { FormsModule } from '@angular/forms'; // Para el [(ngModel)]
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordService } from '../../../../services/PasswordService';
import { ForgotPasswordDTO, ResetPasswordDTO } from '../../../../interfaces/password';
// 1. Importa ChangeDetectorRef
//import { Component, ChangeDetectorRef } from '@angular/core'; 
// ... los demás imports iguales

@Component({
  selector: 'app-restablecer-clave-model',
  standalone: true, // Asegúrate de que esté marcado como standalone si usas 'imports'
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './restablecer-clave-model.html',
  styleUrl: './restablecer-clave-model.css',
})
export class RestablecerClaveModel {
  correo: string = "";
  token: string = "";
  nuevaClave: string = "";
  paso: number = 1;
  isLoading: boolean = false;

  constructor(
    private _passwordServicio: PasswordService,
    private _snackBar: MatSnackBar,
    private dialogoRef: MatDialogRef<RestablecerClaveModel>,
    private cdr: ChangeDetectorRef // 2. Inyéctalo aquí
  ) {}

  enviarCorreo() {
    if (!this.correo) return;
    
    this.isLoading = true;
    const dto: ForgotPasswordDTO = { correo: this.correo };

    this._passwordServicio.forgotPassword(dto).subscribe({
      next: (response) => {
        // 3. Cambiamos los valores
        this.paso = 2;
        this.isLoading = false;
        
        // 4. FORZAMOS la detección de cambios para que la UI se entere YA
        this.cdr.detectChanges(); 
        
        this._snackBar.open("Código enviado", "Éxito", { duration: 3000 });
      },
      error: (error) => {
        this.isLoading = false;
        this.cdr.detectChanges(); // También en el error
        const mensajeError = typeof error.error === 'string' ? error.error : "Error al enviar el correo";
        this._snackBar.open(mensajeError, "Error", { duration: 3000 });
      }
    });
  }

  cambiarClave() {
    if (!this.token || !this.nuevaClave) return;
    this.isLoading = true;

    const dto: ResetPasswordDTO = { 
      token: this.token, 
      nuevaClave: this.nuevaClave 
    };
// --- LOGS DE DEPURACIÓN ---
  console.log("🚀 Iniciando restablecimiento de contraseña...");
  console.log("📦 Datos enviados (DTO):", dto);
  console.log("📝 JSON stringify:", JSON.stringify(dto));
    this._passwordServicio.resetPassword(dto).subscribe({
      next: (data) => {
        console.log("✅ Respuesta exitosa del servidor:", data);
        this._snackBar.open("Contraseña actualizada correctamente", "Éxito", { duration: 3000 });
        this.dialogoRef.close();
      },
      error: (e) => {
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzamos para ocultar el spinner en el error
        this._snackBar.open("Token inválido o código incorrecto", "Error", { duration: 3000 });
      }
    });
  }

  cerrar() { this.dialogoRef.close(); }
}