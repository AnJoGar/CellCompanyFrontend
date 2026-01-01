
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../../../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-modal-eliminar-usuario',
  imports: [CommonModule,     
    MatDialogModule,  // Para que el HTML reconozca mat-dialog-content, etc.
    MatButtonModule],
  templateUrl: './modal-eliminar-usuario.html',
  styleUrl: './modal-eliminar-usuario.css',
})
export class ModalEliminarUsuario {
 constructor(
    private dialogoReferencia: MatDialogRef<ModalEliminarUsuario>,
    @Inject(MAT_DIALOG_DATA) public usuarioEliminar: Usuario
  ) {

  }

  ngOnInit(): void {
  }

   eliminarUsuario() {
     if (this.usuarioEliminar) {
      this.dialogoReferencia.close('eliminar')
     }
  }
}
