import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { ReporteInterface } from '../../../interfaces/reporte';
import { ReportService } from '../../../services/Reporte-service';
import moment from 'moment';
import { MatChipsModule } from '@angular/material/chips';
import { ModalPago } from '../modal/modal-pago/modal-pago';
import { MatDialog } from '@angular/material/dialog';
import { ModalCalendario } from '../modal/modal-calendario/modal-calendario';
import { ModalAgregarCreditoComponent } from '../modal/modal-agregar-credito-component/modal-agregar-credito-component';
import Swal from 'sweetalert2';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
@Component({
  selector: 'app-pagos-component',
  imports: [ CommonModule,
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
     MatGridListModule,
       MatChipsModule  //],
  
       ],     templateUrl: './pagos-component.html',
  styleUrl: './pagos-component.css',
})
export class PagosComponent {
 formGroup: FormGroup;
  ELEMENT_DATA: ReporteInterface[] = [];
  
  // Columnas COMPLETAS para la tabla con TODOS los campos
  displayedColumns: string[] = [
    'codigoUnico',
    // CLIENTE
    'clienteId',
    'nombreCliente',
    'cedula',
    'telefonoCliente',
    'direccionCliente',
    
    
    // TIENDA
    'tiendaId',
    'nombreTienda',
    'encargadoTienda',
    'telefonoTienda',
    
    // CRÉDITO
    'creditoId',
    'nombrePropietario',
    'marca',
    'modelo',
 'capacidad',
    'entrada',
    'montoTotal',
    'montoPendiente',
    'plazoCuotas',
    'frecuenciaPago',
    'valorPorCuota',
    'proximaCuota',
    'estadoCredito',
    'estadoCuota',
    'abonadoTotal',
    'abonadoCuota',
    
    // FECHAS
    'fechaCreditoStr',
    
    // ACCIONES
    'acciones',
    'registrarCredito',
    'eliminar'
  ];
// Agrega estas propiedades después de displayedColumns
filtroEstadoCredito: string = 'Todos';
filtroEstadoCuota: string = 'Todos';

  dataSource = new MatTableDataSource<ReporteInterface>(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ReporteServicio: ReportService,
    private _snackBar: MatSnackBar,
     private dialog: MatDialog
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarReportes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarReportes() {
    this._ReporteServicio.reporteCreditosSinFecha().subscribe({
      next: (data) => {
        if (data.status) {
          this.ELEMENT_DATA = data.value;
          this.dataSource.data = data.value;
        } else {
          this.ELEMENT_DATA = [];
          this.dataSource.data = [];
        }
      },
      error: (e) => {
        console.error('Error al cargar reportes:', e);
        this._snackBar.open('Error al cargar datos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmitForm() {
    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY');
    
    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
      this.cargarReportes();
      return;
    }

    this._ReporteServicio.reporteCreditos(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if (data.status) {
          this.ELEMENT_DATA = data.value;
          this.dataSource.data = data.value;
          this._snackBar.open(`Se encontraron ${data.value.length} registros`, 'Éxito', { 
            duration: 2000 
          });
        } else {
          this.ELEMENT_DATA = [];
          this.dataSource.data = [];
          this._snackBar.open("No se encontraron datos", 'Info', { duration: 2000 });
        } 
      },
      error: (e) => {
        console.error('Error al buscar reportes:', e);
        this._snackBar.open("Error al buscar datos", 'Error', { duration: 2000 });
      }
    });
  }

  // Filtro local (alternativo si no quieres hacer petición al servidor)
  onSubmitFormLocal() {
    const _fechaInicio = moment(this.formGroup.value.fechaInicio, 'DD/MM/YYYY');
    const _fechaFin = moment(this.formGroup.value.fechaFin, 'DD/MM/YYYY');
    
    if (!_fechaInicio.isValid() || !_fechaFin.isValid()) {
      this._snackBar.open("Debe ingresar ambas fechas válidas", 'Oops!', { duration: 2000 });
      this.dataSource.data = this.ELEMENT_DATA;
      return;
    }

    const filteredData = this.ELEMENT_DATA.filter((item) => {
      const fechaCredito = moment(item.fechaCreditoStr, 'DD/MM/YYYY');
      return fechaCredito.isBetween(_fechaInicio, _fechaFin, 'day', '[]');
    });
  
    if (filteredData.length > 0) {
      this.dataSource.data = filteredData;
      this._snackBar.open(`Se encontraron ${filteredData.length} registros`, 'Éxito', { 
        duration: 2000 
      });
    } else {
      this.dataSource.data = [];
      this._snackBar.open("No se encontraron datos en ese rango", 'Info', { duration: 2000 });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Método para limpiar filtros
  limpiarFiltros1() {
    this.formGroup.reset();
    this.cargarReportes();
    this._snackBar.open("Filtros limpiados", 'Info', { duration: 1500 });
  }

aplicarFiltroEstadoCredito(estado: string) {
  this.filtroEstadoCredito = estado;
  this.aplicarFiltrosCombinados();
}

aplicarFiltroEstadoCuota(estado: string) {
  this.filtroEstadoCuota = estado;
  this.aplicarFiltrosCombinados();
}

aplicarFiltrosCombinados() {
  let datosFiltrados = [...this.ELEMENT_DATA];

  // Filtrar por estado de crédito
  if (this.filtroEstadoCredito !== 'Todos') {
    datosFiltrados = datosFiltrados.filter(
      item => item.estadoCredito === this.filtroEstadoCredito
    );
  }

  // Filtrar por estado de cuota
  if (this.filtroEstadoCuota !== 'Todos') {
    datosFiltrados = datosFiltrados.filter(
      item => item.estadoCuota === this.filtroEstadoCuota
    );
  }

  this.dataSource.data = datosFiltrados;
  
  // Mensaje informativo
  const mensaje = `Mostrando ${datosFiltrados.length} de ${this.ELEMENT_DATA.length} créditos`;
  this._snackBar.open(mensaje, 'Info', { duration: 2000 });
}

// Modifica el método limpiarFiltros para incluir los nuevos filtros
limpiarFiltros() {
  this.formGroup.reset();
  this.filtroEstadoCredito = 'Todos';
  this.filtroEstadoCuota = 'Todos';
  this.cargarReportes();
  this._snackBar.open("Filtros limpiados", 'Info', { duration: 1500 });
}

exportarExcel() {
  const _fechaInicio = this.formGroup.value.fechaInicio 
    ? moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY') 
    : undefined;
  const _fechaFin = this.formGroup.value.fechaFin 
    ? moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY') 
    : undefined;

  this._snackBar.open('Generando archivo Excel...', 'Espere', { duration: 2000 });

  this._ReporteServicio.exportarExcel(_fechaInicio, _fechaFin).subscribe({
    next: (blob) => {
      // Crear un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Nombre del archivo con fecha actual
      const fechaActual = moment().format('YYYY-MM-DD_HHmmss');
      link.download = `reporte_creditos_${fechaActual}.xlsx`;
      
      // Simular click para descargar
      link.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      
      this._snackBar.open('Archivo descargado exitosamente', 'Éxito', { 
        duration: 3000 
      });
    },
    error: (error) => {
      console.error('Error al exportar Excel:', error);
      this._snackBar.open('Error al generar el archivo Excel', 'Error', { 
        duration: 3000 
      });
    }
  });
}
  // ===== MÉTODOS DE ACCESO A DATOS DEL CLIENTE =====
  obtenerClienteId(item: ReporteInterface): number {
    return item.clienteId;
  }

  obtenerNombreCliente(item: ReporteInterface): string {
    return item.nombreCliente;
  }

  obtenerCedula(item: ReporteInterface): string {
    return item.cedula;
  }

  obtenerTelefonoCliente(item: ReporteInterface): string {
    return item.telefonoCliente;
  }

  obtenerDireccionCliente(item: ReporteInterface): string {
    return item.direccionCliente;
  }
     obtenerCodigoCredito(item: ReporteInterface): string {
    return item.codigoUnico;
  }

  obtenerFotoClienteUrl(item: ReporteInterface): string {
    return item.fotoClienteUrl;
  }

  // ===== MÉTODOS DE ACCESO A DATOS DE LA TIENDA =====
  obtenerTiendaId(item: ReporteInterface): number | undefined {
    return item.tiendaId;
  }

  obtenerNombreTienda(item: ReporteInterface): string {
    return item.nombreTienda;
  }

  obtenerEncargadoTienda(item: ReporteInterface): string {
    return item.encargadoTienda;
  }

  obtenerTelefonoTienda(item: ReporteInterface): string {
    return item.telefonoTienda;
  }

  // ===== MÉTODOS DE ACCESO A DATOS DEL CRÉDITO =====
  obtenerCreditoId(item: ReporteInterface): number {
    return item.creditoId;
  }

  obtenerMarca(item: ReporteInterface): string {
    return item.marca;
  }

  obtenerModelo(item: ReporteInterface): string {
    return item.modelo;
  }

  obtenerFotoContrato(item: ReporteInterface): string {
    return item.fotoContrato;
  }

  obtenerFotoCelularEntregadoUrl(item: ReporteInterface): string {
    return item.fotoCelularEntregadoUrl;
  }

  obtenerEntrada(item: ReporteInterface): number {
    return item.entrada;
  }

  obtenerMontoTotal(item: ReporteInterface): number {
    return item.montoTotal;
  }

  obtenerMontoPendiente(item: ReporteInterface): number {
    return item.montoPendiente;
  }

  obtenerPlazoCuotas(item: ReporteInterface): number {
    return item.plazoCuotas;
  }

  obtenerFrecuenciaPago(item: ReporteInterface): string {
    return item.frecuenciaPago;
  }

  obtenerValorPorCuota(item: ReporteInterface): number {
    return item.valorPorCuota;
  }

  obtenerProximaCuota(item: ReporteInterface): string | Date {
    return item.proximaCuota;
  }

  obtenerEstadoCredito(item: ReporteInterface): string {
    return item.estadoCredito;
  }

  obtenerEstadoCuota(item: ReporteInterface): string {
    return item.estadoCuota;
  }

  obtenerAbonadoTotal(item: ReporteInterface): number {
    return item.abonadoTotal;
  }

  obtenerAbonadoCuota(item: ReporteInterface): number {
    return item.abonadoCuota;
  }

  // ===== MÉTODOS DE ACCESO A FECHAS =====
  obtenerFechaCreditoStr(item: ReporteInterface): string {
    return item.fechaCreditoStr;
  }

  // ===== MÉTODOS DE CÁLCULO TOTALES =====
  calcularMontoTotal(): number {
    return this.dataSource.filteredData.reduce((sum, item) => sum + item.montoTotal, 0);
  }

  calcularMontoPendienteTotal(): number {
    return this.dataSource.filteredData.reduce((sum, item) => sum + item.montoPendiente, 0);
  }

  calcularAbonadoTotal(): number {
    return this.dataSource.filteredData.reduce((sum, item) => sum + item.abonadoTotal, 0);
  }

  calcularEntradaTotal(): number {
    return this.dataSource.filteredData.reduce((sum, item) => sum + item.entrada, 0);
  }

  calcularAbonadoCuotaTotal(): number {
    return this.dataSource.filteredData.reduce((sum, item) => sum + item.abonadoCuota, 0);
  }

  // ===== MÉTODOS DE FORMATEO =====
// En tu archivo .component.ts
formatearFecha(fecha: any): string {
  if (!fecha) return '---'; // Maneja valores nulos o vacíos
  
  // moment() detecta automáticamente si es string ISO o Date y lo convierte
  const fechaParseada = moment(fecha);
  
  if (!fechaParseada.isValid()) {
    return 'Fecha inválida';
  }

  return fechaParseada.format('DD/MM/YYYY');
}

  formatearMoneda(monto: number): string {
    return `$${monto.toFixed(2)}`;
  }

  // ===== MÉTODOS DE ESTADÍSTICAS =====
  obtenerEstadoCreditos(): { estado: string, cantidad: number, porcentaje: number }[] {
    const total = this.dataSource.filteredData.length;
    const estadosMap = new Map<string, number>();
    
    this.dataSource.filteredData.forEach(item => {
      const count = estadosMap.get(item.estadoCredito) || 0;
      estadosMap.set(item.estadoCredito, count + 1);
    });

    const resultado: { estado: string, cantidad: number, porcentaje: number }[] = [];
    estadosMap.forEach((cantidad, estado) => {
      resultado.push({
        estado,
        cantidad,
        porcentaje: total > 0 ? (cantidad / total) * 100 : 0
      });
    });

    return resultado;
  }

  obtenerEstadoCuotas(): { estado: string, cantidad: number, porcentaje: number }[] {
    const total = this.dataSource.filteredData.length;
    const estadosMap = new Map<string, number>();
    
    this.dataSource.filteredData.forEach(item => {
      const count = estadosMap.get(item.estadoCuota) || 0;
      estadosMap.set(item.estadoCuota, count + 1);
    });

    const resultado: { estado: string, cantidad: number, porcentaje: number }[] = [];
    estadosMap.forEach((cantidad, estado) => {
      resultado.push({
        estado,
        cantidad,
        porcentaje: total > 0 ? (cantidad / total) * 100 : 0
      });
    });

    return resultado;
  }

  obtenerCreditosPorTienda(): { 
    tiendaId: number | undefined,
    tienda: string, 
    encargado: string,
    telefono: string,
    cantidad: number, 
    monto: number,
    pendiente: number,
    abonado: number
  }[] {
    const tiendasMap = new Map<string, { 
      tiendaId: number | undefined,
      encargado: string,
      telefono: string,
      cantidad: number, 
      monto: number,
      pendiente: number,
      abonado: number
    }>();
    
    this.dataSource.filteredData.forEach(item => {
      const tienda = item.nombreTienda || 'Sin tienda';
      const data = tiendasMap.get(tienda) || { 
        tiendaId: item.tiendaId,
        encargado: item.encargadoTienda,
        telefono: item.telefonoTienda,
        cantidad: 0, 
        monto: 0,
        pendiente: 0,
        abonado: 0
      };
      data.cantidad++;
      data.monto += item.montoTotal;
      data.pendiente += item.montoPendiente;
      data.abonado += item.abonadoTotal;
      tiendasMap.set(tienda, data);
    });

    const resultado: { 
      tiendaId: number | undefined,
      tienda: string, 
      encargado: string,
      telefono: string,
      cantidad: number, 
      monto: number,
      pendiente: number,
      abonado: number
    }[] = [];
    
    tiendasMap.forEach((data, tienda) => {
      resultado.push({
        tiendaId: data.tiendaId,
        tienda,
        encargado: data.encargado,
        telefono: data.telefono,
        cantidad: data.cantidad,
        monto: data.monto,
        pendiente: data.pendiente,
        abonado: data.abonado
      });
    });

    return resultado.sort((a, b) => b.monto - a.monto);
  }

  obtenerCreditosPorFrecuenciaPago(): { frecuencia: string, cantidad: number, monto: number }[] {
    const frecuenciaMap = new Map<string, { cantidad: number, monto: number }>();
    
    this.dataSource.filteredData.forEach(item => {
      const data = frecuenciaMap.get(item.frecuenciaPago) || { cantidad: 0, monto: 0 };
      data.cantidad++;
      data.monto += item.montoTotal;
      frecuenciaMap.set(item.frecuenciaPago, data);
    });

    const resultado: { frecuencia: string, cantidad: number, monto: number }[] = [];
    frecuenciaMap.forEach((data, frecuencia) => {
      resultado.push({
        frecuencia,
        cantidad: data.cantidad,
        monto: data.monto
      });
    });

    return resultado;
  }

  obtenerCreditosPorMarca(): { marca: string, modelo: string[], cantidad: number, monto: number }[] {
    const marcaMap = new Map<string, { modelos: Set<string>, cantidad: number, monto: number }>();
    
    this.dataSource.filteredData.forEach(item => {
      const data = marcaMap.get(item.marca) || { modelos: new Set(), cantidad: 0, monto: 0 };
      data.modelos.add(item.modelo);
      data.cantidad++;
      data.monto += item.montoTotal;
      marcaMap.set(item.marca, data);
    });

    const resultado: { marca: string, modelo: string[], cantidad: number, monto: number }[] = [];
    marcaMap.forEach((data, marca) => {
      resultado.push({
        marca,
        modelo: Array.from(data.modelos),
        cantidad: data.cantidad,
        monto: data.monto
      });
    });

    return resultado.sort((a, b) => b.monto - a.monto);
  }

  // ===== MÉTODOS DE BÚSQUEDA Y FILTRADO =====
  buscarPorCliente(clienteId: number): ReporteInterface[] {
    return this.ELEMENT_DATA.filter(item => item.clienteId === clienteId);
  }

  buscarPorCedula(cedula: string): ReporteInterface[] {
    return this.ELEMENT_DATA.filter(item => item.cedula === cedula);
  }

  buscarPorTienda(tiendaId: number): ReporteInterface[] {
    return this.ELEMENT_DATA.filter(item => item.tiendaId === tiendaId);
  }

  buscarPorCredito(creditoId: number): ReporteInterface | undefined {
    return this.ELEMENT_DATA.find(item => item.creditoId === creditoId);
  }

  filtrarPorEstadoCredito(estado: string): ReporteInterface[] {
    return this.dataSource.filteredData.filter(item => item.estadoCredito === estado);
  }

  filtrarPorEstadoCuota(estado: string): ReporteInterface[] {
    return this.dataSource.filteredData.filter(item => item.estadoCuota === estado);
  }

  filtrarPorFrecuenciaPago(frecuencia: string): ReporteInterface[] {
    return this.dataSource.filteredData.filter(item => item.frecuenciaPago === frecuencia);
  }

  filtrarPorMarca(marca: string): ReporteInterface[] {
    return this.dataSource.filteredData.filter(item => item.marca === marca);
  }
  verImagen(url: string) {
  if (url) {
    window.open(url, '_blank');
  } else {
    this._snackBar.open('No hay imagen disponible', 'Info', { duration: 2000 });
  }
}




abrirModalPago(element: ReporteInterface) {
  const dialogRef = this.dialog.open(ModalPago, {
    disableClose: true,
    width: '500px',
    data: {
      creditoId: element.creditoId,
      montoPendiente: element.montoPendiente,
      nombreCliente: element.nombreCliente,
      valorPorCuota: element.valorPorCuota,
      cedula: element.cedula,  // ← AGREGAR
      nombreTienda: element.nombreTienda,  // ← AGREGAR
      proximaCuota: element.proximaCuota  // ← AGREGAR
    }
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado === 'pagado') {
      this._snackBar.open('Pago registrado exitosamente', 'Éxito', { duration: 3000 });
      this.cargarReportes(); // Recargar datos
    }
  });
}



abrirModalCredito(element: ReporteInterface) {
  const dialogRef = this.dialog.open(ModalAgregarCreditoComponent, {
    disableClose: true,
  width: '950px', // Un poco menos de 1000 para dejar margen
    maxWidth: '95vw', // Ocupa el 95% del ancho de la pantalla si es pequeña
    maxHeight: '90vh',
    data: {
      clienteId: element.clienteId,
      tiendaAppId:element.tiendaId,
      creditoId: element.creditoId,
      montoPendiente: element.montoPendiente,
      nombreCliente: element.nombreCliente,
      valorPorCuota: element.valorPorCuota,
      cedula: element.cedula,  // ← AGREGAR
      nombreTienda: element.nombreTienda,  // ← AGREGAR
      proximaCuota: element.proximaCuota  // ← AGREGAR
    }
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado === 'pagado') {
      this._snackBar.open('Pago registrado exitosamente', 'Éxito', { duration: 3000 });
      this.cargarReportes(); // Recargar datos
    }
  });
}

// En reporte.component.ts - Asegúrate de tener este método
verCalendarioPagos(element: ReporteInterface) {
  const dialogRef = this.dialog.open(ModalCalendario, {
    width: '900px',
    maxHeight: '90vh',
    disableClose: false,
    data: {
      creditoId: element.creditoId,
      clienteId: element.clienteId,
      codigoUnico: element.codigoUnico,
      nombreCliente: element.nombreCliente,
      montoTotal: element.montoTotal
    }
  });

  // Opcional: hacer algo cuando se cierre
  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) {
      console.log('Modal cerrado:', resultado);
    }
  });
}

eliminarCredito(credito: ReporteInterface) {
  Swal.fire({
    title: "¿Desea eliminar el crédito?",
    html: `
      <strong>Cliente:</strong> ${credito.nombreCliente}<br>
      <strong>Crédito ID:</strong> ${credito.creditoId}<br>
      <strong>Monto Total:</strong> $${credito.montoTotal.toFixed(2)}<br>
      <strong>Pendiente:</strong> $${credito.montoPendiente.toFixed(2)}
    `,
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      this._ReporteServicio.eliminarCredito(credito.creditoId).subscribe({
        next: (data) => {
          if (data.status) {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El crédito fue eliminado correctamente',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            });
            this.cargarReportes();
          } else {
            Swal.fire({
              title: 'Error',
              text: data.msg || 'No se pudo eliminar el crédito',
              icon: 'error',
              confirmButtonColor: '#3085d6'
            });
          }
        },
        error: (e) => {
          console.error('Error al eliminar:', e);
          Swal.fire({
            title: 'Error',
            text: 'Error de conexión al intentar eliminar el crédito',
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        }
      });
    }
  });
}
}