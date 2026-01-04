import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ProductoBodegaService } from '../../../../services/ProductoService';
import { ProductoBodega } from '../../../../interfaces/Bodega';

@Component({
  selector: 'app-modal-producto',
  imports: [  CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule],
  templateUrl: './modal-producto.html',
  styleUrl: './modal-producto.css',
})
export class ModalProducto  implements OnInit, AfterViewInit {


  formulario: FormGroup;
  accion: string = 'Agregar';
  accionBoton: string = 'Guardar';
  isLoading: boolean = false;

  // Opciones para los selects
  tiposProducto: string[] = [
    'Celular',
    'Tv',
    'Tablet',
    'Laptop',
    'Accesorio',
    'Smartwatch',
    'Auriculares',
    'Otro'
  ];

  estadosProducto: string[] = [
    'Nuevo',
    
    'En Reparación'
  ];

  constructor(
    private dialogoReferencia: MatDialogRef<ModalProducto>,
    @Inject(MAT_DIALOG_DATA) public datosProducto: ProductoBodega,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _productoBodegaService: ProductoBodegaService
  ) {
    this.formulario = this.fb.group({
      tipoProducto: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      imei: [''],
      serie: [''],
      color: [''],
      tamano: [''],
      estado: ['Nuevo', Validators.required],
      precioCompra: ['', [Validators.required, Validators.min(0)]],
      precioVenta: ['', Validators.min(0)]
    });

    if (this.datosProducto != null) {
      this.accion = 'Editar';
      this.accionBoton = 'Actualizar';
    }
  }

  ngOnInit(): void {
    if (this.datosProducto != null) {
      this.formulario.patchValue({
        tipoProducto: this.datosProducto.tipoProducto,
        marca: this.datosProducto.marca,
        modelo: this.datosProducto.modelo,
        imei: this.datosProducto.imei,
        serie: this.datosProducto.serie,
        color: this.datosProducto.color,
        tamano: this.datosProducto.tamano,
        estado: this.datosProducto.estado,
        precioCompra: this.datosProducto.precioCompra,
        precioVenta: this.datosProducto.precioVenta
      });
    }
  }

  ngAfterViewInit() {
  }

  agregarEditarProducto() {
    if (this.formulario.invalid) {
      this.mostrarAlerta('Por favor complete los campos requeridos', 'Error');
      return;
    }

   const producto: any = {
  id: 0,              // Agrégalo en 0
  codigo: "",
  tiendaId: 1,         // Envía un string vacío
  tipoProducto: this.formulario.value.tipoProducto,
  marca: this.formulario.value.marca,
  modelo: this.formulario.value.modelo,
  imei: this.formulario.value.imei || "",
  serie: this.formulario.value.serie || "",
  color: this.formulario.value.color || "",
  tamano: this.formulario.value.tamano || "",
  estado: this.formulario.value.estado,
  precioCompra: parseFloat(this.formulario.value.precioCompra),
  //precioVenta: this.formulario.value.precioVenta 
    //? parseFloat(this.formulario.value.precioVenta) 
    //: 0,
  fechaIngreso: new Date().toISOString(), // Envía la fecha actual en formato ISO
  diasEnBodega: 0     // Envíalo en 0
};
console.log("📦 Enviando a la API:", JSON.stringify(producto, null, 2));
    this.isLoading = true;

    if (this.datosProducto == null) {
      // CREAR PRODUCTO
      this._productoBodegaService.crear(producto).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta(
              `Producto registrado con código: ${data.value.codigo}`,
              'Exito'
            );
            this.dialogoReferencia.close('agregado');
          } else {
            this.mostrarAlerta(data.msg || 'No se pudo registrar', 'Error');
            this.isLoading = false;
          }
        },
        error: (e) => {
          console.error('Error:', e);
          this.mostrarAlerta('Error de conexión con el servidor', 'Error');
          this.isLoading = false;
        }
      });
    } else {
      // EDITAR PRODUCTO
      producto.id = this.datosProducto.id;
      producto.codigo = this.datosProducto.codigo;
      producto.fechaIngreso = this.datosProducto.fechaIngreso;
      producto.diasEnBodega = this.datosProducto.diasEnBodega;

      this._productoBodegaService.editar(producto).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta('Producto actualizado correctamente', 'Exito');
            this.dialogoReferencia.close('editado');
          } else {
            this.mostrarAlerta('No se pudo actualizar', 'Error');
            this.isLoading = false;
          }
        },
        error: (e) => {
          console.error('Error:', e);
          this.mostrarAlerta('Error al actualizar producto', 'Error');
          this.isLoading = false;
        }
      });
    }
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }



}
