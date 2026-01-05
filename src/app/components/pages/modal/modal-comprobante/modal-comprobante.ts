import { Component, Inject } from '@angular/core';
// components/pages/modal/comprobante-pago/comprobante-pago.ts

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
export interface DatosComprobante {
  numeroComprobante: string;
  creditoId: number;
  codigoUnico: string;
  nombreCliente: string;
  cedula: string;
  montoPagado: number;
  metodoPago: string;
  fechaPago: Date;
  nombreTienda?: string;
  montoPendiente?: number;
  proximaCuota?: string;
}
@Component({
  selector: 'app-modal-comprobante',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './modal-comprobante.html',
  styleUrl: './modal-comprobante.css',
})
export class ModalComprobante {
   fechaActual: Date = new Date();

  constructor(
    private dialogRef: MatDialogRef<ModalComprobante>,
    @Inject(MAT_DIALOG_DATA) public datos: DatosComprobante
  ) {}

  imprimir() {
    window.print();
  }

  cerrar() {
    this.dialogRef.close();
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

    formatearSoloFecha(fechaStr: string): string {
    if (!fechaStr) return 'N/A';
    
    const fecha = new Date(fechaStr);
    
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) return fechaStr;
    
    return fecha.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }


  formatearMoneda(monto: number): string {
    return `$${monto.toFixed(2)}`;
  }
}
