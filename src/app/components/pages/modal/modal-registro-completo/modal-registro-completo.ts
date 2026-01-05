
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';

import { CommonModule } from '@angular/common';
import { UsuarioRegistroService } from '../../../../services/UsuarioCompleto-service';
import { UsuarioRegistro } from '../../../../interfaces/registroCompleto';
import { ClienteRegistro } from '../../../../interfaces/registroCompleto';
import { DetalleCliente } from '../../../../interfaces/registroCompleto';
import { TiendaApp } from '../../../../interfaces/registroCompleto';
import { CreditoRegistro } from '../../../../interfaces/registroCompleto';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA,  } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-registro-completo',
  imports: [CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './modal-registro-completo.html',
  styleUrl: './modal-registro-completo.css',
})
export class ModalRegistroCompleto implements OnInit {
formUsuario: FormGroup;
  formCliente: FormGroup;
  formCredito: FormGroup;
  isLoading = false;
tituloAccion: string = "Agregar";

  botonAccion: string = "Guardar";
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialogoRef: MatDialogRef<ModalRegistroCompleto>,
    private _usuarioServicio: UsuarioRegistroService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any // Tu servicio de usuario
  ) {
    // Paso 1: Usuario
    this.formUsuario = this.fb.group({
      nombreApellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required],
      rolId: [3, Validators.required] // Por defecto cliente
    });

    // Paso 2: Detalle Cliente
    this.formCliente = this.fb.group({
      numeroCedula: ['', [Validators.required, Validators.minLength(10)]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      cedulaEncargado: ['', Validators.required],
      estadoDeComision: ['', Validators.required],
      
  // 🔥 AGREGA ESTA LÍNEA:
  nombrePropietario: ['']// Para TiendaApps
    });

    // Paso 3: Crédito
    this.formCredito = this.fb.group({
      montoTotal: [0, [Validators.required, Validators.min(1)]],
      entrada: [0, Validators.required],
      plazoCuotas: [12, [Validators.required, Validators.min(1)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      imei: ['', Validators.required],
      capacidad: [0, Validators.required],
      frecuenciaPago: ['Semanal', Validators.required]
    });

    if (this.data && this.data.creditoEditar) {
      console.log("Modo edición detectado (lógica opcional aquí)");
    }
  }

  ngOnInit(): void {


if (this.data && this.data.usuario) {
      const u = this.data.usuario; // Alias para acortar el código
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";

      // 3. RELLENAR FORMULARIO USUARIO
      this.formUsuario.patchValue({
        nombreApellidos: u.nombreApellidos,
        correo: u.correo,
        rolId: u.rolId
        // La clave usualmente no se rellena por seguridad
      });

      // 4. RELLENAR FORMULARIO CLIENTE (Navegando en la estructura anidada)
      if (u.cliente) {
        this.formCliente.patchValue({
          numeroCedula: u.cliente.detalleCliente?.numeroCedula,
          telefono: u.cliente.detalleCliente?.telefono,
          direccion: u.cliente.detalleCliente?.direccion,
          nombrePropietario: u.cliente.detalleCliente?.nombrePropietario,
          cedulaEncargado: u.cliente.tiendaApps?.[0]?.cedulaEncargado,
            estadoDeComision: u.cliente.tiendaApps?.[0]?.estadoDeComision // Sacamos el valor del array
        });

        // 5. RELLENAR FORMULARIO CRÉDITO (Sacamos datos del primer crédito)
        if (u.cliente.creditos && u.cliente.creditos.length > 0) {
          const c = u.cliente.creditos[0];
          this.formCredito.patchValue({
            montoTotal: c.montoTotal,
            entrada: c.entrada,
            plazoCuotas: c.plazoCuotas,
            marca: c.marca,
            modelo: c.modelo,
            imei: c.imei,
            capacidad: c.capacidad,
            frecuenciaPago: c.frecuenciaPago
          });
        }
      }
    }

  }

registrarTodo() {
    if (this.formUsuario.invalid || this.formCliente.invalid || this.formCredito.invalid) {
      this.mostrarAlerta("Por favor, complete todos los campos obligatorios", "Validación");
      return;
    }

   // this.isLoading = true;
    const fechaISO = new Date().toISOString();
    
    // Cálculos de montos
    const total = Number(this.formCredito.value.montoTotal);
    const entrada = Number(this.formCredito.value.entrada);
    const pendiente = total - entrada;

   const usuarioDTO = {
    id: this.data?.usuario?.id || 0,
    nombreApellidos: this.formUsuario.value.nombreApellidos,
    correo: this.formUsuario.value.correo,
    rolId: Number(this.formUsuario.value.rolId),
    rolDescripcion: "",
    clave: this.formUsuario.value.clave,
    esActivo: 1,
    cliente: {
     id: this.data?.usuario?.cliente?.id || 0,
     usuarioId: this.data?.usuario?.id || 0,
     detalleClienteID: this.data?.usuario?.cliente?.detalleClienteID || 0,
      detalleCliente: {
       id: this.data?.usuario?.cliente?.detalleCliente?.id || 0,
        numeroCedula: this.formCliente.value.numeroCedula,
        nombreApellidos: this.formUsuario.value.nombreApellidos,
       
        telefono: this.formCliente.value.telefono,
        direccion: this.formCliente.value.direccion
      },
      tiendaApps: [{
       id: this.data?.usuario?.cliente?.tiendaApps?.[0]?.id || 0,
        cedulaEncargado: this.formCliente.value.cedulaEncargado,
        estadoDeComision:this.formCliente.value.estadoDeComision,
        fechaRegistro: fechaISO,
        clienteId: 0
      }],
      creditos: [{
       id: this.data?.usuario?.cliente?.creditos?.[0]?.id || 0,
        nombrePropietario: this.formCliente.value.nombrePropietario || "", // 👈 Agregado
        entrada: Number(this.formCredito.value.entrada),
        montoTotal: Number(this.formCredito.value.montoTotal),
        montoPendiente: Number(this.formCredito.value.montoTotal) - Number(this.formCredito.value.entrada),
        plazoCuotas: Number(this.formCredito.value.plazoCuotas),
        frecuenciaPago: this.formCredito.value.frecuenciaPago || "Semanal", // 👈 ESTE FALTABA
        diaPago: fechaISO,
        valorPorCuota: 0,
        proximaCuota: fechaISO,
        proximaCuotaStr: "",
        estado: "Activo",
        metodoPago: "Efectivo",
        marca: this.formCredito.value.marca,
        modelo: this.formCredito.value.modelo,
        imei: this.formCredito.value.imei,
        tipoProducto: "Celular",
        capacidad: Number(this.formCredito.value.capacidad) || 0,
        abonadoTotal: 0,
        abonadoCuota: 0,
        estadoCuota: "Pendiente",
        fechaCreacion: fechaISO,
        clienteId: 0,
        tiendaAppId: 0
      }]
    }
  };
this.isLoading = true;

    if (this.data && this.data.usuario) {
      // LLAMAR A EDITAR
      this._usuarioServicio.editarCompleto(usuarioDTO).subscribe({
        next: (res) => {
          if (res.status) {
            this.mostrarAlerta("Usuario actualizado", "Éxito");
            this.dialogoRef.close("editado");
          }
        },
        error: () => this.isLoading = false
      });
    } else {
      // LLAMAR A CREAR
      this._usuarioServicio.crearUsuarioCompleto(usuarioDTO).subscribe({
        next: (res) => {
          if (res.status) {
            this.mostrarAlerta("Usuario registrado", "Éxito");
            this.dialogoRef.close("agregado");
          }
        },
        error: () => this.isLoading = false
      });
    }
  }

  mostrarAlerta(msg: string, tipo: string) {
    this._snackBar.open(msg, tipo, { duration: 3000 });
  }
}
