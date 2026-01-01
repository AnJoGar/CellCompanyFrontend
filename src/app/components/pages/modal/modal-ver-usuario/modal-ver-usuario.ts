import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../../../interfaces/usuario';
import { UsuarioService } from '../../../../services/usuario';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-ver-usuario',
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './modal-ver-usuario.html',
  styleUrl: './modal-ver-usuario.css',
})
export class ModalVerUsuario implements OnInit {
  id!: number;
  usuario!: Usuario;
  loading: boolean = true; // Inicia en true

  constructor(
    private _servicioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ModalVerUsuario>,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Usuario }
  ) {}

  ngOnInit(): void {
    // Ejecuta en el próximo ciclo usando Promise.resolve()
    Promise.resolve().then(() => {
      this.obtenerServicio();
    });
  }

  obtenerServicio() {
    const usuarioId = this.data.usuario.id;

    this._servicioService.ObtenerUsuarioId(usuarioId).subscribe({
      next: (data) => {
        this.usuario = data;
        this.loading = false;
        // Detecta cambios manualmente después de actualizar
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}