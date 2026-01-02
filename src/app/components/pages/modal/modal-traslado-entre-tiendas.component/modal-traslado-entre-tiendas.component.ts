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
  selector: 'app-modal-traslado-entre-tiendas.component',
  imports: [ CommonModule,
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
  templateUrl: './modal-traslado-entre-tiendas.component.html',
  styleUrl: './modal-traslado-entre-tiendas.component.css',
})
export class ModalTrasladoEntreTiendasComponent  implements OnInit {
formularioTraslado: FormGroup;
  tituloModal: string = "Trasladar Producto entre Tiendas";
  producto: ProductoBodega;
  todasLasTiendas: TiendaDestino[] = [];
  tiendasDestino: TiendaDestino[] = [];
  tiendaOrigenNombre: string = '';
  isLoading: boolean = false;
  guardando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ModalTrasladoEntreTiendasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductoBodega,
    private _movimientoService: MovimientoInventarioService,
    private _tiendaInventarioService: TiendaInventarioService,
    private _snackBar: MatSnackBar
  ) {
    this.producto = data;
    
    // 👇 Debug: Ver qué tiendaId tiene el producto
    console.log('🔍 Producto recibido:', this.producto);
    console.log('🔍 TiendaId del producto:', this.producto.tiendaId);
    
    this.formularioTraslado = this.fb.group({
      productoId: [this.producto.id, Validators.required],
      tiendaOrigenId: [this.producto.tiendaId, Validators.required],
      tiendaDestinoId: ['', Validators.required],
      observacion: ['']
    });
  }

  ngOnInit(): void {
    this.cargarTiendas();
  }

  cargarTiendas() {
    this.isLoading = true;
    this.formularioTraslado.get('tiendaDestinoId')?.disable();
    
    this._tiendaInventarioService.obtenerTiendasDisponibles().subscribe({
      next: (response) => {
        console.log('📦 Respuesta de tiendas:', response); // 👈 Debug
        
        if (response.status) {
          this.todasLasTiendas = response.value;
          
          console.log('📦 Todas las tiendas:', this.todasLasTiendas); // 👈 Debug
          console.log('🔍 Buscando tienda con id:', this.producto.tiendaId); // 👈 Debug
          
          // Buscar la tienda origen
          const tiendaOrigen = this.todasLasTiendas.find(t => {
            console.log(`Comparando: ${t.id} === ${this.producto.tiendaId}`); // 👈 Debug
            return t.id === this.producto.tiendaId;
          });
          
          console.log('✅ Tienda origen encontrada:', tiendaOrigen); // 👈 Debug
          
          if (tiendaOrigen) {
            this.tiendaOrigenNombre = tiendaOrigen.nombreTienda;
          } else {
            // Si no encuentra la tienda, mostrar el ID
            this.tiendaOrigenNombre = `Tienda ID: ${this.producto.tiendaId}`;
            console.warn('⚠️ No se encontró la tienda origen en la lista');
          }
          
          // Filtrar tiendas destino (todas EXCEPTO la tienda origen)
          this.tiendasDestino = this.todasLasTiendas.filter(
            (t: TiendaDestino) => t.id !== this.producto.tiendaId
          );
          
          console.log('✅ Tienda origen:', this.tiendaOrigenNombre);
          console.log('✅ Tiendas destino disponibles:', this.tiendasDestino);
          
          this.formularioTraslado.get('tiendaDestinoId')?.enable();
        } else {
          this._snackBar.open(response.msg || 'No se pudieron cargar las tiendas', 'Error', { duration: 3000 });
        }
        this.isLoading = false;
      },
      error: (e) => {
        console.error('❌ Error al cargar tiendas:', e);
        this._snackBar.open('Error al cargar tiendas disponibles', 'Error', { duration: 3000 });
        this.isLoading = false;
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
    this.formularioTraslado.disable();
    
    const formValues = this.formularioTraslado.getRawValue(); // 👈 getRawValue para obtener campos deshabilitados
    const nombreUsuario = localStorage.getItem('usuario') || 'Usuario Sistema';

    const objetoTraslado: TrasladoProducto = {
      productoId: formValues.productoId,
      tiendaOrigenId: formValues.tiendaOrigenId,
      tiendaDestinoId: formValues.tiendaDestinoId,
      observacion: formValues.observacion || '',
      usuarioRegistro: nombreUsuario
    };

    console.log("🚀 Enviando traslado entre tiendas:", objetoTraslado);

    this._movimientoService.registrarTraslado(objetoTraslado).subscribe({
      next: (response) => {
        this.guardando = false;
        this.formularioTraslado.enable();
        
        if (response.status) {
          const tiendaDestino = this.tiendasDestino.find(t => t.id === formValues.tiendaDestinoId);
          
          Swal.fire({
            title: '¡Traslado Exitoso!',
            html: `
              <p>El producto <strong>${this.producto.marca} ${this.producto.modelo}</strong></p>
              <p>ha sido trasladado de:</p>
              <p><strong>${this.tiendaOrigenNombre}</strong> ➔ <strong>${tiendaDestino?.nombreTienda}</strong></p>
            `,
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
        this.formularioTraslado.enable();
        
        console.error('❌ Error al trasladar:', e);
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
    return this.tiendasDestino.find(t => t.id === tiendaId);
  }
}
