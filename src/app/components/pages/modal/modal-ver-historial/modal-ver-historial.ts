import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MovimientoInventarioService } from '../../../../services/MovimientoInventarioService';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ProductoBodega } from '../../../../interfaces/Bodega';
@Component({
  selector: 'app-modal-ver-historial',
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule],
  templateUrl: './modal-ver-historial.html',
  styleUrl: './modal-ver-historial.css',
})
export class ModalVerHistorial {
historial: any[] = [];
  loading: boolean = true;
  producto: ProductoBodega;

  constructor(
    private _movimientoService: MovimientoInventarioService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ModalVerHistorial>,
    @Inject(MAT_DIALOG_DATA) public data: { producto: ProductoBodega }
  ) {
    this.producto = data.producto;
  }

  ngOnInit(): void {
    this.obtenerHistorial();
  }

  obtenerHistorial() {
    // Si el producto no tiene IMEI, podrías usar el ID o el código
    const identificador = this.producto.imei || this.producto.codigo;

    this._movimientoService.obtenerHistorialPorIMEI(identificador).subscribe({
      next: (response) => {
        if (response.status) {
          this.historial = response.value;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener historial:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
