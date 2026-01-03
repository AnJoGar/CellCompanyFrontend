
// components/pages/modal/modal-pago-credito/modal-pago-credito.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PagoCredito } from '../../../../interfaces/Pago';
import { CreditoService } from '../../../../services/Pago-Service'; // Asume que tienes este servicio
import { ModalComprobante, DatosComprobante } from '../modal-comprobante/modal-comprobante';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-pago',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './modal-pago.html',
  styleUrl: './modal-pago.css',
})
export class ModalPago implements OnInit {




 formPago: FormGroup;
  accion: string = 'Registrar Pago';
  accionBoton: string = 'Guardar Pago';
  isLoading: boolean = false;
  
  metodosPago: string[] = [
    'Efectivo',
    'Transferencia',
    'Tarjeta de Crédito',
    'Tarjeta de Débito',
    'Depósito Bancario',
    'Cheque'
  ];

  constructor(
    private dialogRef: MatDialogRef<ModalPago>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      codigoUnico: string,
      creditoId: number, 
      montoPendiente?: number,
       nombreCliente?: string,
      
       valorPorCuota?: number,
       cedula?: string,
    nombreTienda?: string,
    proximaCuota?: string },
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _pagoService: CreditoService,
     private dialog: MatDialog  // ←  // Descomenta cuando tengas el servicio
  ) {
    this.formPago = this.fb.group({
      montoPagado: ['', [Validators.required, Validators.min(0.01)]],
      metodoPago: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si se pasa el monto pendiente, puedes usarlo como validación
    if (this.data.montoPendiente) {
      this.formPago.get('montoPagado')?.setValidators([
        Validators.required,
        Validators.min(0.01),
        //Validators.max(this.data.montoPendiente)
      ]);
    }
  }

  registrarPago1() {
    if (this.formPago.invalid) {
      this._snackBar.open('Por favor complete todos los campos correctamente', 'Error', {
        duration: 3000
      });
      return;
      
    }
    const pago: PagoCredito = {
      creditoId: this.data.creditoId,
      montoPagado: this.formPago.value.montoPagado,
      metodoPago: this.formPago.value.metodoPago
    };

    this.isLoading = true;

    // Descomenta cuando tengas el servicio
    
    this._pagoService.registrarPago(pago).subscribe({
      next: (response) => {
        if (response.status) {
          this.mostrarAlerta('Pago registrado correctamente', 'Éxito');
          this.dialogRef.close('pagado');
        } else {
          this.mostrarAlerta(response.msg || 'No se pudo registrar el pago', 'Error');
          this.isLoading = false;
        }
      },
      error: (e) => {
        console.error('Error:', e);
        this.mostrarAlerta('Error de conexión con el servidor', 'Error');
        this.isLoading = false;
      }
    });
    

    // TEMPORAL: Simula respuesta exitosa (elimina esto cuando tengas el servicio)
    setTimeout(() => {
      this.mostrarAlerta('Pago registrado correctamente', 'Éxito');

      this.dialogRef.close('pagado');
    }, 1500);
  }

  registrarPago() {
  if (this.formPago.invalid) {
    this._snackBar.open('Por favor complete todos los campos correctamente', 'Error', {
      duration: 3000
    });
    return;
  }

  const pago: PagoCredito = {
    creditoId: this.data.creditoId,
    montoPagado: this.formPago.value.montoPagado,
    metodoPago: this.formPago.value.metodoPago
  };

  this.isLoading = true;

  this._pagoService.registrarPago(pago).subscribe({
    next: (response) => {
      if (response.status) {
        this.mostrarAlerta('Pago registrado correctamente', 'Éxito');
        
        // Generar número de comprobante
        const numeroComprobante = `PAG-${Date.now()}`;
        
        // Calcular nuevo monto pendiente
        const nuevoMontoPendiente = (this.data.montoPendiente || 0) - pago.montoPagado;
        
        // Preparar datos del comprobante
        const datosComprobante: DatosComprobante = {
          numeroComprobante: numeroComprobante,
          creditoId: pago.creditoId,
         codigoUnico: this.data.codigoUnico,
          nombreCliente: this.data.nombreCliente || 'N/A',
          cedula: this.data.cedula || 'N/A',
          montoPagado: pago.montoPagado,
          metodoPago: this.formPago.value.metodoPago,
          fechaPago: new Date(),
          nombreTienda: this.data.nombreTienda,
          montoPendiente: nuevoMontoPendiente,
          proximaCuota: this.data.proximaCuota
        };
        
        // Cerrar este modal
        this.dialogRef.close('pagado');
        
        // Abrir comprobante
        this.dialog.open(ModalComprobante, {
           width: '600px',  // ← Cambiar de 800px a 600px
  maxHeight: '90vh',  // ← AGREGAR esto
          //width: '800px',
          data: datosComprobante,
          disableClose: false
        });
        
      } else {
        this.mostrarAlerta(response.msg || 'No se pudo registrar el pago', 'Error');
        this.isLoading = false;
      }
    },
    error: (e) => {
      console.error('Error:', e);
      this.mostrarAlerta('Error de conexión con el servidor', 'Error');
      this.isLoading = false;
    }
  });
}

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    });
  }


public comprobante(){


}
}
