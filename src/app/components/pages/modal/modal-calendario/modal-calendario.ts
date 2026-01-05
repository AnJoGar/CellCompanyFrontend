import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { CalendarioService } from '../../../../services/Historial-service';
import { HistoriaApp } from '../../../../interfaces/HistoriaApp';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './modal-calendario.html',
  styleUrl: './modal-calendario.css'
})
export class ModalCalendario implements OnInit {
  displayedColumns: string[] = ['numero', 'fecha', 'montoCuota', 'montoPendiente', 'estado'];
  calendarioPagos: HistoriaApp[] = [];
  isLoading: boolean = false;
  error: string = '';

  totalCuotas: number = 0;
  cuotasPagadas: number = 0;
  cuotasPendientes: number = 0;
  totalPagado: number = 0;
  totalPendiente: number = 0;

  constructor(
    private dialogRef: MatDialogRef<ModalCalendario>,
    @Inject(MAT_DIALOG_DATA) public data: {
      creditoId: number,
      codigoUnico?: string,
      clienteId: number,
      nombreCliente?: string,
      montoTotal?: number
    },
    private _calendarioService: CalendarioService,
    private cdr: ChangeDetectorRef  // ← AGREGAR ESTO
  ) { }

  async ngOnInit() {
    await this.cargarCalendario();
  }

  async cargarCalendario() {
    try {
      this.isLoading = true;
      this.cdr.detectChanges();  // ← Forzar detección ANTES de cargar

      const response = await firstValueFrom(
        this._calendarioService.obtenerCalendarioPagos(this.data.creditoId, this.data.clienteId)
      );

      if (response && response.length > 0) {
        this.calendarioPagos = response;
        this.calcularEstadisticas();
        this.error = '';
      } else {
        this.error = 'No se encontraron cuotas para este crédito';
        this.calendarioPagos = [];
      }
    } catch (e) {
      console.error('Error al cargar calendario:', e);
      this.error = 'Error al cargar el calendario de pagos';
      this.calendarioPagos = [];
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();  // ← Forzar detección DESPUÉS de cargar
    }
  }

  calcularEstadisticas() {
    // 1. Obtener el monto total del crédito (Deuda original)
    // Nos aseguramos de que sea un número
    const montoTotalCredito = this.data.montoTotal || 0;

    // 2. Calcular TOTAL PAGADO (Incluyendo la Entrada/Abono Inicial)
    // Recorremos TODO el calendario (incluyendo el índice 0)
    // Sumamos 'abonadoCuota' solo si el estado es 'Pagado'
    this.totalPagado = this.calendarioPagos
      .filter(c => c.estadoCuota === 'Pagado')
      .reduce((sum, c) => sum + (c.abonadoCuota || 0), 0);

    // 3. Calcular SALDO PENDIENTE (Dinámico)
    // Es simplemente la resta del Total menos lo que ya se pagó.
    // A medida que 'totalPagado' suba, 'totalPendiente' bajará.
    this.totalPendiente = montoTotalCredito - this.totalPagado;

    // Evitar números negativos por errores de decimales
    if (this.totalPendiente < 0) this.totalPendiente = 0;

    // 4. Conteos de Cuotas (Para mostrar "5 de 12 cuotas")
    // Aquí sí ignoramos la entrada (index 0) para contar solo las letras/cuotas reales
    const cuotasReales = this.calendarioPagos.slice(1);

    this.totalCuotas = cuotasReales.length;
    this.cuotasPagadas = cuotasReales.filter(c => c.estadoCuota === 'Pagado').length;
    this.cuotasPendientes = cuotasReales.filter(c => c.estadoCuota !== 'Pagado').length;

    // Refrescar la vista
    this.cdr.detectChanges();
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatearMoneda(monto: number): string {
    return `$${monto.toFixed(2)}`;
  }

  obtenerColorEstado(estado: string): string {
    return estado === 'Pagado' ? '#388e3c' : '#f57c00';
  }

  obtenerPorcentajePagado(): number {
    if (this.totalCuotas === 0) return 0;
    return Math.round((this.cuotasPagadas / this.totalCuotas) * 100);
  }

  cerrar() {
    this.dialogRef.close();
  }

  imprimir() {
    window.print();
  }
}