import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';






import { MatSortModule } from '@angular/material/sort';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



import { TiendaInventarioService } from '../../../services/TiendaInventarioService';
import { ProductoBodegaService } from '../../../services/ProductoService';
import { ProductoBodega } from '../../../interfaces/Bodega';
import { TiendaDestino } from '../../../interfaces/MovimientoInventario';
import { ModalProducto } from '../../../components/pages/modal/modal-producto/modal-producto';
import { ModalTrasladoProductoComponent } from '../modal/modal-traslado-producto-component/modal-traslado-producto-component';
import { ModalTrasladoEntreTiendasComponent } from '../modal/modal-traslado-entre-tiendas.component/modal-traslado-entre-tiendas.component';
import { ModalVerHistorial } from '../modal/modal-ver-historial/modal-ver-historial';


@Component({
  selector: 'app-inventario-tienda-component',
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatChipsModule],
  templateUrl: './inventario-tienda-component.html',
  styleUrl: './inventario-tienda-component.css',
})
export class InventarioTiendaComponent  implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'codigo',
    'tipoProducto',
    'marca',
    'modelo',
    'imei',
    'color',
    'estado',
    'precioCompra',
    'precioVenta',
    'fechaIngreso',
    'diasEnBodega',
    
    'acciones',
    'trasladar'
  ];

  ELEMENT_DATA: ProductoBodega[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  searchValue: string = '';
  
  // KPIs
  totalProductos: number = 0;
  totalInversion: number = 0;
  valorVentaTotal: number = 0;
  productosEnAlerta: number = 0;
  
  // Tiendas
  listaTiendas: TiendaDestino[] = [];
  tiendaSeleccionada: number | null = null;
  nombreTiendaSeleccionada: string = '';
  isLoadingTiendas: boolean = false;
  isLoadingProductos: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _tiendaInventarioService: TiendaInventarioService,
    private _productoBodegaService: ProductoBodegaService
  ) {}

  ngOnInit(): void {
    this.cargarTiendas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarTiendas() {
    this.isLoadingTiendas = true;
    this._tiendaInventarioService.obtenerTiendasDisponibles().subscribe({
      next: (response) => {
        if (response.status) {
          // Filtrar para NO mostrar la bodega central (id: 1)
          this.listaTiendas = response.value.filter((t: TiendaDestino) => t.id !== 1);
          
          // Auto-seleccionar la primera tienda si existe
          if (this.listaTiendas.length > 0) {
            this.tiendaSeleccionada = this.listaTiendas[0].id;
            this.nombreTiendaSeleccionada = this.listaTiendas[0].nombreTienda;
            this.cargarProductosPorTienda();
          }
        } else {
          this._snackBar.open('No se pudieron cargar las tiendas', 'Error', { duration: 3000 });
        }
        this.isLoadingTiendas = false;
      },
      error: (e) => {
        console.error('Error al cargar tiendas:', e);
        this._snackBar.open('Error al cargar tiendas', 'Error', { duration: 3000 });
        this.isLoadingTiendas = false;
      }
    });
  }

  onTiendaChange() {
    if (this.tiendaSeleccionada) {
      const tienda = this.listaTiendas.find(t => t.id === this.tiendaSeleccionada);
      this.nombreTiendaSeleccionada = tienda?.nombreTienda || '';
      this.cargarProductosPorTienda();
    }
  }

  cargarProductosPorTienda() {
    if (!this.tiendaSeleccionada) {
      this._snackBar.open('Seleccione una tienda', 'Advertencia', { duration: 2000 });
      return;
    }

    this.isLoadingProductos = true;
    this._tiendaInventarioService.obtenerProductosTienda(this.tiendaSeleccionada).subscribe({
      next: (response) => {
        if (response.status) {
          this.dataSource.data = response.value;
          this.calcularKpis(response.value);
          
          if (response.value.length === 0) {
            this._snackBar.open(`No hay productos en ${this.nombreTiendaSeleccionada}`, 'Info', { duration: 2000 });
          }
        } else {
          this._snackBar.open('No se encontraron productos', 'Error', { duration: 3000 });
          this.limpiarKpis();
        }
        this.isLoadingProductos = false;
      },
      error: (e) => {
        console.error('Error al cargar productos:', e);
        this._snackBar.open('Error al cargar productos de la tienda', 'Error', { duration: 3000 });
        this.isLoadingProductos = false;
        this.limpiarKpis();
      }
    });
  }

  calcularKpis(productos: ProductoBodega[]) {
    this.totalProductos = productos.length;
    this.totalInversion = productos.reduce((acc, item) => acc + (Number(item.precioCompra) || 0), 0);
    this.valorVentaTotal = productos.reduce((acc, item) => acc + (Number(item.precioVenta) || 0), 0);
    this.productosEnAlerta = productos.filter(p => p.diasEnBodega > 30).length;
  }

  limpiarKpis() {
    this.totalProductos = 0;
    this.totalInversion = 0;
    this.valorVentaTotal = 0;
    this.productosEnAlerta = 0;
    this.dataSource.data = [];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.calcularKpis(this.dataSource.filteredData);
  }

  editarProducto(producto: ProductoBodega) {
    this.dialog.open(ModalProducto, {
      disableClose: true,
      width: '700px',
      data: producto
    }).afterClosed().subscribe(result => {
      if (result === 'editado') {
        this.cargarProductosPorTienda();
      }
    });
  }

  verHistorial(producto: ProductoBodega) {
    // Aquí puedes implementar un modal para ver el historial de movimientos
    this.dialog.open(ModalVerHistorial, {
    width: '550px',
    maxHeight: '80vh',
    data: { producto: producto }
  });
  }

  formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      return new Date(fecha).toLocaleDateString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    return fecha.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(precio);
  }

  getEstadoClass(estado: string): string {
    const estados: { [key: string]: string } = {
      'Nuevo': 'estado-nuevo',
      'Disponible': 'estado-disponible',
      'Reservado': 'estado-reservado',
      'Vendido': 'estado-vendido',
      'En Reparación': 'estado-reparacion'
    };
    return estados[estado] || 'estado-default';
  }

  getColorDiasBodega(dias: number): string {
    if (dias <= 7) return 'dias-reciente';
    if (dias <= 30) return 'dias-normal';
    return 'dias-antiguo';
  }


    trasladarProducto(producto: ProductoBodega) {
    this.dialog.open(ModalTrasladoEntreTiendasComponent, {
      disableClose: true,
      width: '650px',
     data: { 
      ...producto, 
      tiendaId: this.tiendaSeleccionada 
    }
    }).afterClosed().subscribe(result => {
      if (result === 'trasladado') {
        this.cargarProductosPorTienda(); // Recargar la tabla
      }
    });
  }
}
