import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

import { UsuarioRegistroService } from '../../../services/UsuarioCompleto-service';
import { UsuarioRegistro } from '../../../interfaces/registroCompleto';
import { ModalRegistroCompleto } from '../modal/modal-registro-completo/modal-registro-completo';


import { MatChipsModule } from '@angular/material/chips';





@Component({
  selector: 'app-registro-completo-component',
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatPaginatorModule],
  templateUrl: './registro-completo-component.html',
  styleUrl: './registro-completo-component.css',
})
export class RegistroCompletoComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'nombreApellidos',
    'correo',
    'rol',
    'cedula',
    'telefono',
    'direccion',
    //'nombrePropietario',
    'cedulaEncargado',
    'montoTotal',
    'entrada',
    'montoPendiente',
    'plazoCuotas',
    'marca',
    'modelo',
    'imei',
    'capacidad',
    'estadoDeComision',
    'editar',
    'eliminar',

  ];

  ELEMENT_DATA: UsuarioRegistro[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  searchValue: string = '';
  filtro: string = 'todos';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _usuarioRegistroServicio: UsuarioRegistroService
  ) { }

  ngOnInit(): void {
    this.filtro = 'todos';
    this.mostrarRegistros();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.searchValue;
  }

  onSearchInput() {
    if (this.searchValue === '') {
      this.filtro = 'todos';
      this.applyFilterEstado();
    }
  }

  mostrarRegistros() {
    this._usuarioRegistroServicio.obtenerRegistroSinId().subscribe({
      next: (data) => {
        // Como la API devuelve el JSON directo [...] (según tu imagen)
        // verificamos si data es un array y si tiene elementos
        if (Array.isArray(data) && data.length > 0) {
          this.dataSource.data = data;
        } else if (Array.isArray(data) && data.length === 0) {
          this._snackBar.open("Cargando usuarios", '', { duration: 2000 });
          this.dataSource.data = [];
        } else {
          // En caso de que la respuesta sea nula o inesperada
          this._snackBar.open("Error en el formato de datos", 'Oops!', { duration: 2000 });
        }
      },
      error: (e) => {
        console.error("Error al cargar registros:", e);
        this.mostrarAlerta("Error al cargar los datos del servidor", "Error");
      }
    });
  }

  defaultFilterPredicate(data: UsuarioRegistro, filter: string): boolean {
    const filterValue = filter.trim().toLowerCase();
    const cedula = data.cliente?.detalleCliente?.numeroCedula || '';
    const telefono = data.cliente?.detalleCliente?.telefono || '';
    const direccion = data.cliente?.detalleCliente?.direccion || '';
    const marca = data.cliente?.creditos?.[0]?.marca || '';
    const modelo = data.cliente?.creditos?.[0]?.modelo || '';
    const imei = data.cliente?.creditos?.[0]?.imei || '';

    if (this.filtro === 'no activo') {
      return data.esActivo === 0 && (
        data.nombreApellidos.toLowerCase().includes(filterValue) ||
        data.correo.toLowerCase().includes(filterValue) ||
        data.rolDescripcion.toLowerCase().includes(filterValue) ||
        cedula.toLowerCase().includes(filterValue) ||
        telefono.toLowerCase().includes(filterValue) ||
        direccion.toLowerCase().includes(filterValue) ||
        marca.toLowerCase().includes(filterValue) ||
        modelo.toLowerCase().includes(filterValue) ||
        imei.toLowerCase().includes(filterValue) ||
        data.id.toString().includes(filterValue)
      );
    } else if (this.filtro === 'todos') {
      return (
        data.nombreApellidos.toLowerCase().includes(filterValue) ||
        data.correo.toLowerCase().includes(filterValue) ||
        data.rolDescripcion.toLowerCase().includes(filterValue) ||
        cedula.toLowerCase().includes(filterValue) ||
        telefono.toLowerCase().includes(filterValue) ||
        direccion.toLowerCase().includes(filterValue) ||
        marca.toLowerCase().includes(filterValue) ||
        modelo.toLowerCase().includes(filterValue) ||
        imei.toLowerCase().includes(filterValue) ||
        data.id.toString().includes(filterValue)
      );
    } else if (this.filtro === 'activo') {
      return data.esActivo === 1 && (
        data.nombreApellidos.toLowerCase().includes(filterValue) ||
        data.correo.toLowerCase().includes(filterValue) ||
        data.rolDescripcion.toLowerCase().includes(filterValue) ||
        cedula.toLowerCase().includes(filterValue) ||
        telefono.toLowerCase().includes(filterValue) ||
        direccion.toLowerCase().includes(filterValue) ||
        marca.toLowerCase().includes(filterValue) ||
        modelo.toLowerCase().includes(filterValue) ||
        imei.toLowerCase().includes(filterValue) ||
        data.id.toString().includes(filterValue)
      );
    }
    return true;
  }

  applyFilterEstado() {
    switch (this.filtro) {
      case 'todos':
        this.dataSource.filterPredicate = this.defaultFilterPredicate;
        this.dataSource.filter = '';
        this.mostrarRegistros();
        break;
      case 'no activo':
        this.dataSource.filterPredicate = (data: UsuarioRegistro, filter1: string) => {
          return data.esActivo === 0;
        };
        this.dataSource.filter = 'no activo';
        this.dataSource.filterPredicate = this.defaultFilterPredicate;
        break;
      case 'activo':
        this.dataSource.filterPredicate = (data: UsuarioRegistro, filter1: string) => {
          return data.esActivo === 1;
        };
        this.dataSource.filter = 'activo';
        this.dataSource.filterPredicate = this.defaultFilterPredicate;
        break;
      default:
        this.dataSource.filter = '';
        this.dataSource.filterPredicate = this.defaultFilterPredicate;
        break;
    }

    if (this.filtro !== 'todos' && this.dataSource.filteredData.length === 0) {
      console.log('No existe registro con el filtro seleccionado.');
    }
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  agregarRegistro() {
    this.dialog.open(ModalRegistroCompleto, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === "agregado") {
        this.mostrarRegistros();
      }
    });
  }

  editarRegistro(registro: UsuarioRegistro) {
    this.dialog.open(ModalRegistroCompleto, {
      disableClose: true,
      data: { usuario: registro }
    }).afterClosed().subscribe(result => {
      if (result === "editado") {
        this.filtro = 'todos';
        this.applyFilterEstado();
        this.searchValue = '';
        this.mostrarRegistros();
      }
    });
  }

  eliminarRegistro(registro: UsuarioRegistro) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará permanentemente el registro de ${registro.nombreApellidos}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // Rojo moderno (Tailwind red-500)
      cancelButtonColor: '#94a3b8', // Gris moderno (Slate-400)
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      customClass: {
        title: 'swal2-title-custom', // Puedes definir estos estilos en styles.css global
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn'
      },
      reverseButtons: true // Pone el botón de cancelar primero (patrón UX más seguro)
    }).then((result) => {
      if (result.isConfirmed) {

        // Mostrar loading mientras elimina
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this._usuarioRegistroServicio.eliminar(registro.id).subscribe({
          next: (data) => {
            if (data.status) {
              // Éxito con estilo
              Swal.fire({
                title: '¡Eliminado!',
                text: 'El registro ha sido eliminado correctamente.',
                icon: 'success',
                confirmButtonColor: '#1e293b' // Azul oscuro corporativo
              });
              this.mostrarRegistros();
            } else {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el registro. Intente nuevamente.',
                icon: 'error',
                confirmButtonColor: '#1e293b'
              });
            }
          },
          error: (e) => {
            console.error("Error al eliminar:", e);
            Swal.fire({
              title: 'Error de Servidor',
              text: 'Ocurrió un problema al conectar con el servidor.',
              icon: 'error',
              confirmButtonColor: '#1e293b'
            });
          }
        });
      }
    });
  }

  verRegistro(registro: UsuarioRegistro) {
    this.dialog.open(ModalRegistroCompleto, {
      disableClose: true,
      data: { usuario: registro, soloLectura: true }
    }).afterClosed().subscribe(result => {
      // No necesita hacer nada al cerrar
    });
  }
}