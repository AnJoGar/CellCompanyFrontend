import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ubicacion } from '../../../interfaces/ubicacion';
import { UbicacionService } from '../../../services/UbicacionService';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-ubicacion-component',
  imports: [ CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule],
  templateUrl: './ubicacion-component.html',
  styleUrl: './ubicacion-component.css',
})
export class UbicacionComponent  implements OnInit {
  displayedColumns: string[] = [
    'usuarioId',
    'nombreUsuario',
    'correoUsuario',
    'latitud',
    'longitud',
    'fecha',
    'acciones'
  ];

  dataSource = new MatTableDataSource<ubicacion>();
  searchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _ubicacionService: UbicacionService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarTodasLasUbicaciones();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarTodasLasUbicaciones() {
    // Aquí deberías tener un endpoint que devuelva todas las ubicaciones
    // Por ahora simulo la carga de un usuario específico
    // Ajusta esto según tu API
    this._snackBar.open('Cargando ubicaciones...', 'Info', { duration: 2000 });
    
    // Ejemplo: cargar ubicaciones de usuario ID 1
    // Deberías tener un método en tu servicio que obtenga TODAS las ubicaciones
    this._ubicacionService.obtenerUbicacionesPorUsuario().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataSource.data = response.data;
          this._snackBar.open(`${response.data.length} ubicaciones cargadas`, 'Éxito', { 
            duration: 2000 
          });
        } else {
          this.dataSource.data = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar ubicaciones:', error);
        this._snackBar.open('Error al cargar ubicaciones', 'Error', { duration: 3000 });
      }
    });
  }

  buscarPorUsuario() {
    if (!this.searchValue || this.searchValue.trim() === '') {
      this.cargarTodasLasUbicaciones();
      return;
    }

    const usuarioId = parseInt(this.searchValue);
    
    if (isNaN(usuarioId)) {
      this._snackBar.open('Ingrese un ID de usuario válido', 'Advertencia', { 
        duration: 2000 
      });
      return;
    }

    this._ubicacionService.obtenerUbicacionesPorUsuario().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataSource.data = response.data;
          this._snackBar.open(`${response.data.length} ubicaciones encontradas`, 'Éxito', { 
            duration: 2000 
          });
        } else {
          this.dataSource.data = [];
          this._snackBar.open('No se encontraron ubicaciones', 'Info', { 
            duration: 2000 
          });
        }
      },
      error: (error) => {
        console.error('Error:', error);
        this._snackBar.open('Error al buscar ubicaciones', 'Error', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchInput() {
    if (this.searchValue === '') {
      this.cargarTodasLasUbicaciones();
    }
  }

  verEnMapa(ubicacion: ubicacion) {
    const url = `https://www.google.com/maps?q=${ubicacion.latitud},${ubicacion.longitud}`;
    window.open(url, '_blank');
  }

  copiarCoordenadas(ubicacion: ubicacion) {
    const coordenadas = `${ubicacion.latitud}, ${ubicacion.longitud}`;
    navigator.clipboard.writeText(coordenadas).then(() => {
      this._snackBar.open('Coordenadas copiadas al portapapeles', 'Éxito', { 
        duration: 2000 
      });
    });
  }

  formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      return new Date(fecha).toLocaleString('es-EC', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return fecha.toLocaleString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
