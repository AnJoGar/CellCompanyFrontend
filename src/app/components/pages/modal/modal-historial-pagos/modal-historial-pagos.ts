import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreditoService } from '../../../../services/Credito-service';
import { PagoRealizado } from '../../../../interfaces/pagosRealizados';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-historial-pagos',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
    CurrencyPipe,
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './modal-historial-pagos.html',
  styleUrl: './modal-historial-pagos.css',
})
export class ModalHistorialPagos implements OnInit {
  displayedColumns: string[] = ['fecha', 'monto', 'metodo'];

  // 1. Cambiamos el array por un DataSource
  dataSource = new MatTableDataSource<PagoRealizado>([]);

  // Variable para el total
  totalPagado: number = 0;

  constructor(
    private dialogRef: MatDialogRef<ModalHistorialPagos>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _creditoService: CreditoService,
    private cdRef: ChangeDetectorRef // Asegúrate de tenerlo inyectado
  ) { }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this._creditoService.obtenerHistorialPagosRealizados(this.data.creditoId).subscribe({
      next: (res) => {
        if (res.status && res.value) {
          // 2. Usamos setTimeout y asignamos al data source
          setTimeout(() => {
            this.dataSource.data = res.value;

            this.totalPagado = res.value.reduce((sum: number, item: PagoRealizado) => sum + (item.montoPagado || 0), 0);

            this.cdRef.detectChanges();
          }, 0);
        }
      },
      error: (e) => console.error("Error API:", e)
    });
  }

  // Helper para iconos de métodos de pago
  getIconoMetodo(metodo: string): string {
    const m = metodo.toLowerCase();
    if (m.includes('efectivo')) return 'payments';
    if (m.includes('transferencia')) return 'account_balance';
    if (m.includes('tarjeta')) return 'credit_card';
    if (m.includes('depósito') || m.includes('deposito')) return 'savings';
    return 'receipt'; // Default
  }

}