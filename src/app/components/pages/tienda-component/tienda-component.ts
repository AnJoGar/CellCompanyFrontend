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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { TiendaService } from '../../../services/Tienda-Service';
import { Tienda } from '../../../interfaces/Tienda';
import { ModalTienda } from '../modal/modal-tienda/modal-tienda';
//import { ModalVerTienda } from '../modal/modal-ver-tienda/modal-ver-tienda';

@Component({
  selector: 'app-tienda-component',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatSnackBarModule],
  templateUrl: './tienda-component.html',
  styleUrl: './tienda-component.css',
})
export class TiendaComponent {
  displayedColumns: string[] = [
    'id',
    'nombreTienda',
    'nombreEncargado',
    'cedulaEncargado',
    'telefono',
    'direccion',
    'fechaRegistro',
    'acciones',
    'eliminar',
    
  ];

  ELEMENT_DATA: Tienda[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  searchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _tiendaService: TiendaService
  ) {}

  ngOnInit(): void {
    this.cargarTiendas();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarTiendas() {
    this._tiendaService.obtenerTiendas().subscribe({
      next: (data) => {
        if (data.status) {
          this.dataSource.data = data.value;
        } else {
          this._snackBar.open('No se encontraron tiendas', 'Oops!', { duration: 2000 });
        }
      },
      error: (e) => {
        console.error('Error al cargar tiendas:', e);
        this._snackBar.open('Error al cargar tiendas', 'Error', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.searchValue;
  }

  onSearchInput() {
    if (this.searchValue === '') {
      this.cargarTiendas();
    }
  }

  agregarTienda() {
    this.dialog.open(ModalTienda, {
      disableClose: true,
      width: '600px'
    }).afterClosed().subscribe(result => {
      if (result === 'agregado') {
        this.cargarTiendas();
      }
    });
  }

  editarTienda(tienda: Tienda) {
    this.dialog.open(ModalTienda, {
      disableClose: true,
      width: '600px',
      data: tienda
    }).afterClosed().subscribe(result => {
      if (result === 'editado') {
        this.cargarTiendas();
      }
    });
  }

  eliminarTienda(tienda: Tienda) {
    // LOG 1: Verificar qué objeto llega al hacer clic
  console.log("--- Intento de eliminación ---");
  console.log("Objeto tienda recibido:", tienda);
  console.log("ID a enviar:", tienda.id);
    Swal.fire({
      title: '¿Desea eliminar la tienda?',
      text: tienda.nombreTienda,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this._tiendaService.eliminarTienda(tienda.id).subscribe({

          
          next: (data) => {
            if (data.status) {
              this._snackBar.open('La tienda fue eliminada', 'Éxito', { duration: 2000 });
              this.cargarTiendas();
            } else {
              this._snackBar.open('No se pudo eliminar la tienda', 'Error', { duration: 3000 });
            }
          },
          error: (e) => {
            console.error('Error:', e);
            this._snackBar.open('Error al eliminar', 'Error', { duration: 3000 });
          }
        });
      }
    });
  }

  /*verTienda(tienda: Tienda) {
    this.dialog.open(ModalVerTienda, {
      disableClose: true,
      width: '600px',
      data: { tienda }
    });
  }*/

  formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      return new Date(fecha).toLocaleDateString('es-EC');
    }
    return fecha.toLocaleDateString('es-EC');
  }

}
