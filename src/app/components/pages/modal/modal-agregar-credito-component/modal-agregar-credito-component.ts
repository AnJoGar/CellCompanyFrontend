import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

// Interfaces y Servicios
import { Credito } from '../../../../interfaces/credito';
import { CreditoService } from '../../../../services/Credito-service';

// Angular Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-modal-agregar-credito-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDivider
  ],
  templateUrl: './modal-agregar-credito-component.html',
  styleUrl: './modal-agregar-credito-component.css',
})
export class ModalAgregarCreditoComponent implements OnInit, AfterViewInit {
  formCredito: FormGroup;
  accion: string = "Agregar";
  accionBoton: string = "Guardar";
  isLoading: boolean = false;

  constructor(
    private dialogoReferencia: MatDialogRef<ModalAgregarCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any, // Lo manejamos como any para recibir creditoEditar y clienteId
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _creditoServicio: CreditoService
  ) {
    // 1. Inicializamos igual que el de Usuario
    this.formCredito = this.fb.group({
      montoTotal: ['', Validators.required],
      entrada: ['', Validators.required],
      plazoCuotas: ['', Validators.required],
      frecuenciaPago: ['Semanal', Validators.required],
      diaPago: [new Date(), Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      imei: ['', Validators.required],
      tipoProducto: ['Celular', Validators.required],
      capacidad: ['', Validators.required],
      metodoPago: ['Efectivo', Validators.required]
    });

    if (this.datos.creditoEditar != null) {
      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }
  }

  ngOnInit(): void {
    // 2. PatchValue igual que el de Usuario
    if (this.datos.creditoEditar != null) {
      this.formCredito.patchValue({
        montoTotal: this.datos.creditoEditar.montoTotal,
        entrada: this.datos.creditoEditar.entrada,
        plazoCuotas: this.datos.creditoEditar.plazoCuotas,
        frecuenciaPago: this.datos.creditoEditar.frecuenciaPago,
        diaPago: new Date(this.datos.creditoEditar.diaPago),
        marca: this.datos.creditoEditar.marca,
        modelo: this.datos.creditoEditar.modelo,
        imei: this.datos.creditoEditar.imei,
        tipoProducto: this.datos.creditoEditar.tipoProducto,
        capacidad: this.datos.creditoEditar.capacidad,
        metodoPago: this.datos.creditoEditar.metodoPago
      });
    }
  }

  ngAfterViewInit() {
    // Se deja vacío tal cual tu ejemplo funcional
  }

  guardarEditarCredito() {
    if (this.formCredito.invalid) return;

    // 3. Construcción del objeto igual que el de Usuario
    const fechaHoy = new Date().toISOString(); // Formato ISO para C# DateTime
    const idDelCliente = this.datos.clienteId || this.datos.id || 0;

    if (!idDelCliente || isNaN(idDelCliente)) {
      this.mostrarAlerta("Error: No se encontró el ID del cliente", "Error");
      console.error("Los datos recibidos en el modal son:", this.datos);
      return;
    }
    const _credito: any = {
      id: this.datos.creditoEditar == null ? 0 : this.datos.creditoEditar.id,
      montoTotal: Number(this.formCredito.value.montoTotal),
      entrada: Number(this.formCredito.value.entrada),
      plazoCuotas: Number(this.formCredito.value.plazoCuotas),
      frecuenciaPago: this.formCredito.value.frecuenciaPago,
      diaPago: new Date(this.formCredito.value.diaPago).toISOString(),
      marca: this.formCredito.value.marca,
      modelo: this.formCredito.value.modelo,
      imei: this.formCredito.value.imei,
      tipoProducto: this.formCredito.value.tipoProducto,
      capacidad: Number(this.formCredito.value.capacidad),
      metodoPago: this.formCredito.value.metodoPago,
      ClienteId: Number(idDelCliente),

      // CAMPOS OBLIGATORIOS PARA EL DTO DE C# (Bad Request si faltan)
      montoPendiente: 0,
      valorPorCuota: 0,
      proximaCuota: fechaHoy, // C# requiere un DateTime válido
      proximaCuotaStr: "",
      estado: "Activo",
      abonadoTotal: 0,
      abonadoCuota: 0,
      estadoCuota: "Pendiente",
      fechaCreacion: fechaHoy, // Agregado: Es requerido en tu DTO
      tiendaAppId: this.datos.tiendaAppId || null
    };
    console.log("OBJETO ENVIADO A LA API:", _credito); // R

    this.isLoading = true;

    if (this.datos.creditoEditar == null) {
      this._creditoServicio.CreateCredito(_credito).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("Crédito registrado correctamente", "Exito");
            this.dialogoReferencia.close('agregado');
          } else {
            this.mostrarAlerta(data.msg || "No se pudo registrar", "Error");
            this.isLoading = false;
          }
        },
        error: (e) => {
          console.log("DETALLE DEL ERROR:", e);
          this.mostrarAlerta("Error de conexión", "Error");
          this.isLoading = false;
        }
      });
    } else {
      this._creditoServicio.UpdateCredito(_credito).subscribe({
        next: (data) => {
          if (data.status) {
            this.mostrarAlerta("Crédito actualizado correctamente", "Exito");
            this.dialogoReferencia.close('editado');
          } else {
            this.mostrarAlerta("No se pudo editar", "Error");
            this.isLoading = false;
          }
        },
        error: (e) => {
          this.mostrarAlerta("Error al editar", "Error");
          this.isLoading = false;
        }
      });
    }
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
}