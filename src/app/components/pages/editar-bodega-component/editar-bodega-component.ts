
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
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProductoBodegaService } from '../../../services/ProductoService';
import { ProductoBodega } from '../../../interfaces/Bodega';
import { ModalProducto } from '../../../components/pages/modal/modal-producto/modal-producto';
import { ModalTrasladoProductoComponent } from '../modal/modal-traslado-producto-component/modal-traslado-producto-component';

@Component({
  selector: 'app-editar-bodega-component',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatSnackBarModule],
  templateUrl: './editar-bodega-component.html',
  styleUrl: './editar-bodega-component.css',
})
export class EditarBodegaComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'codigo',
    'tipoProducto',
      'propietarioDelProducto',
    'marca',
    'modelo',
    'imei',
    'imei2',
    'color',
    'capacidad',
    'estado',
    'precioCompra',
    'precioVentaContado',
'precioVentaCredito',
    'fechaIngreso',
    'diasEnBodega',
    'observaciones',
    'trasladar',
    'editar',
    'eliminar',
  ];

  ELEMENT_DATA: ProductoBodega[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  searchValue: string = '';
  totalProductos: number = 0;
  totalInversion: number = 0;
  valorVentaTotal: number = 0;
  productosEnAlerta: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _productoBodegaService: ProductoBodegaService
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarProductos() {
    this._productoBodegaService.lista().subscribe({
      next: (data) => {
        if (data.status) {
          // 👇 FILTRAR SOLO PRODUCTOS DE BODEGA (tiendaId = 1)
          const productosBodega = data.value.filter((p: ProductoBodega) => p.tiendaId === 1);

          this.dataSource.data = productosBodega;
          // Ejecutamos los cálculos para las cartillas solo con productos de bodega
          this.calcularKpis(productosBodega);

          // 👇 Opcional: mostrar mensaje si no hay productos en bodega
          if (productosBodega.length === 0) {
            this._snackBar.open('No hay productos en bodega', 'Info', { duration: 2000 });
          }
        } else {
          this._snackBar.open('No se encontraron productos', 'Oops!', { duration: 2000 });
          this.limpiarKpis();
        }
      },
      error: (e) => {
        console.error('Error al cargar productos:', e);
        this._snackBar.open('Error al cargar productos', 'Error', { duration: 3000 });
      }
    });
  }

  calcularKpis(productos: ProductoBodega[]) {
    this.totalProductos = productos.length;

    // Suma de precios de compra
    this.totalInversion = productos.reduce((acc, item) => acc + (Number(item.precioCompra) || 0), 0);

    // Suma de precios de venta (considerando que puede ser nulo)
    this.valorVentaTotal = productos.reduce((acc, item) => acc + (Number(item.precioVentaContado) || 0), 0);

    // Contar productos con más de 30 días (Stock antiguo)
    this.productosEnAlerta = productos.filter(p => p.diasEnBodega > 30).length;
  }

  limpiarKpis() {
    this.totalProductos = 0;
    this.totalInversion = 0;
    this.valorVentaTotal = 0;
    this.productosEnAlerta = 0;
  }

  // --- Filtros y Acciones ---

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Si quieres que los KPIs se actualicen según lo que el usuario filtra en pantalla:
    this.calcularKpis(this.dataSource.filteredData);
  }

  applyFilter1(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.searchValue;
  }

  onSearchInput() {
    if (this.searchValue === '') {
      this.cargarProductos();
    }
  }

  agregarProducto() {
    this.dialog.open(ModalProducto, {
      disableClose: true,
      width: '700px'
    }).afterClosed().subscribe(result => {
      if (result === 'agregado') {
        this.cargarProductos();
      }
    });
  }

  editarProducto(producto: ProductoBodega) {
    this.dialog.open(ModalProducto, {
      disableClose: true,
      width: '700px',
      data: producto
    }).afterClosed().subscribe(result => {
      if (result === 'editado') {
        this.cargarProductos();
      }
    });
  }



  eliminarProducto(producto: ProductoBodega) {
    Swal.fire({
      title: '¿Eliminar Producto?',
      html: `
      <div style="text-align: left; font-size: 14px; color: #334155; line-height: 1.6;">
        <p style="margin: 0;"><strong>Producto:</strong> ${producto.marca} ${producto.modelo}</p>
        <p style="margin: 0;"><strong>Código:</strong> <span style="font-family: monospace; background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #1e293b;">${producto.codigo}</span></p>
        <p style="margin: 0;"><strong>IMEI:</strong> <span style="color: #64748b;">${producto.imei || 'N/A'}</span></p>
      </div>
      <p style="margin-top: 15px; font-size: 13px; color: #ef4444; font-weight: 500;">
        ⚠️ Esta acción eliminará el ítem del inventario permanentemente.
      </p>
    `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Rojo moderno para acciones destructivas
      cancelButtonColor: '#94a3b8', // Gris neutro
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true, // Botón de cancelar a la izquierda (Mejor UX)
      focusCancel: true // Foco en cancelar por seguridad
    }).then(result => {
      if (result.isConfirmed) {

        // Mostrar estado de carga mientras se procesa
        Swal.fire({
          title: 'Eliminando...',
          text: 'Actualizando inventario',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this._productoBodegaService.eliminar(producto.id).subscribe({
          next: (data) => {
            if (data.status) {
              // Éxito
              Swal.fire({
                title: '¡Eliminado!',
                text: 'El producto ha sido retirado de la bodega.',
                icon: 'success',
                confirmButtonColor: '#1e293b'
              });
              this.cargarProductos();
            } else {
              // Error controlado
              Swal.fire({
                title: 'Error',
                text: data.msg || 'No se pudo eliminar el producto.',
                icon: 'error',
                confirmButtonColor: '#1e293b'
              });
            }
          },
          error: (e) => {
            console.error('Error:', e);
            // Error de servidor
            Swal.fire({
              title: 'Error de Servidor',
              text: 'Ocurrió un problema de conexión al intentar eliminar.',
              icon: 'error',
              confirmButtonColor: '#1e293b'
            });
          }
        });
      }
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
    this.dialog.open(ModalTrasladoProductoComponent, {
      disableClose: true,
      width: '650px',
      data: producto
    }).afterClosed().subscribe(result => {
      if (result === 'trasladado') {
        this.cargarProductos(); // Recargar la tabla
      }
    });
  }
}
