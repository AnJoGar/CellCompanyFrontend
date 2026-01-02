import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { MovimientoInventarioService } from '../../../../services/MovimientoInventarioService';
import { TiendaInventarioService } from '../../../../services/TiendaInventarioService';
import { ProductoBodega } from '../../../../interfaces/Bodega';
import { TiendaDestino, TrasladoProducto } from '../../../../interfaces/MovimientoInventario';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modal-traslado-producto-component',
  imports: [  CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule],
  templateUrl: './modal-traslado-producto-component.html',
  styleUrl: './modal-traslado-producto-component.css',
})
export class ModalTrasladoProductoComponent implements OnInit{
formularioTraslado: FormGroup;
  tituloModal: string = "Trasladar Producto a Tienda";
  producto: ProductoBodega;
  listaTiendas: TiendaDestino[] = [];
  isLoading: boolean = false;
  guardando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalTrasladoProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoBodega,
    private _movimientoService: MovimientoInventarioService,
    private _tiendaInventarioService: TiendaInventarioService,
    private _snackBar: MatSnackBar
  ) {
    this.producto = data;
    
    this.formularioTraslado = this.fb.group({
      productoId: [this.producto.id, Validators.required],
      tiendaOrigenId: [1, Validators.required], // Bodega central = 1
      tiendaDestinoId: ['', Validators.required],
      observacion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTiendasDisponibles();
  }

  
  cargarTiendasDisponibles() {
    this.isLoading = true;
    
    // 👇 Deshabilitar mientras carga
    this.formularioTraslado.get('tiendaDestinoId')?.disable();
    
    this._tiendaInventarioService.obtenerTiendasDisponibles().subscribe({
      next: (response) => {
        console.log('Respuesta del servicio:', response); // 👈 Debug
        
        if (response.status) {
          // Filtrar para no mostrar la bodega central (id: 1)
          this.listaTiendas = response.value.filter((t: TiendaDestino) => t.id !== 1);
          console.log('Tiendas cargadas:', this.listaTiendas); // 👈 Debug
          
          // 👇 Habilitar después de cargar
          this.formularioTraslado.get('tiendaDestinoId')?.enable();
        } else {
          this._snackBar.open(response.msg || 'No se pudieron cargar las tiendas', 'Error', { duration: 3000 });
        }
        this.isLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar tiendas:', e);
        this._snackBar.open('Error al cargar tiendas disponibles', 'Error', { duration: 3000 });
        this.isLoading = false;
        // 👇 Habilitar incluso si hay error para que el usuario pueda intentar de nuevo
        this.formularioTraslado.get('tiendaDestinoId')?.enable();
      }
    });
  }

 registrarTraslado() {
  if (this.formularioTraslado.invalid) {
    this._snackBar.open('Por favor complete todos los campos requeridos', 'Advertencia', { duration: 3000 });
    return;
  }

  this.guardando = true;
  
  // 1. Obtener valores del formulario
  const formValues = this.formularioTraslado.value;
  
  // 2. Obtener usuario del localStorage
  const nombreUsuario = localStorage.getItem('usuario') || 'Usuario Sistema';

  // 3. Crear el objeto final con la estructura que pide el API
  const objetoTraslado: TrasladoProducto = {
    productoId: formValues.productoId,
    tiendaOrigenId: formValues.tiendaOrigenId,
    tiendaDestinoId: formValues.tiendaDestinoId,
    observacion: formValues.observacion,
    usuarioRegistro: nombreUsuario // 👈 Aquí se inyecta el campo faltante
  };

  console.log("🚀 Enviando objeto corregido:", objetoTraslado);

  this._movimientoService.registrarTraslado(objetoTraslado).subscribe({
    next: (response) => {
      this.guardando = false;
      if (response.status) {
        Swal.fire({
          title: '¡Traslado Exitoso!',
          text: `El producto ${this.producto.marca} ${this.producto.modelo} ha sido trasladado correctamente`,
          icon: 'success',
          confirmButtonColor: '#17789e'
        });
        this.dialogRef.close('trasladado');
      } else {
        Swal.fire({
          title: 'Error',
          text: response.msg || 'No se pudo registrar el traslado',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    },
    error: (e) => {
      this.guardando = false;
      console.error('❌ Error 400 - Detalles del servidor:', e.error); // 👈 Revisa esto en consola
      Swal.fire({
        title: 'Error',
        text: e.error?.msg || 'Ocurrió un error al procesar el traslado',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  });
}

  cerrarModal() {
    this.dialogRef.close();
  }

  get tiendaSeleccionada(): TiendaDestino | undefined {
    const tiendaId = this.formularioTraslado.get('tiendaDestinoId')?.value;
    return this.listaTiendas.find(t => t.id === tiendaId);
  }
}
